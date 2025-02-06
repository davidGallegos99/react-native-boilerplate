import React, { useEffect, useRef, useState } from 'react'
import { View, Text, StyleSheet, Animated, ActivityIndicator, FlatList, TouchableOpacity, Image, BackHandler, Dimensions, ImageSourcePropType } from "react-native"
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import ReactNativeModal from "react-native-modal"
import Loader from '@ui/components/Loader'
import { ModalSalir } from "./src/components/modalSalir"
import pC from './src/theme/colores'
import ConfettiCannon from 'react-native-confetti-cannon'
import Particles from './src/components/Particulas'
import Orientation from 'react-native-orientation-locker'
import {playSound, stopSound} from "./src/components/Audio"


const { width, height } = Dimensions.get('window')

const Parejas = () => {
  const [status, setStatus] = useState(0)
  const [encabezado, setEncabezado] = useState<string>("")
  const [descripcion, setDescripcion] = useState<string>("")
  const [botonModalTexto, setBotonModalTexto] = useState <string>("")
  const [modalActivado, setModalActivado] = useState<boolean>(false)
  const [tostadaActivada, setTostadaActivada] = useState<boolean>(false)

  const [mostrarConfetti, setMostrarConfetti] = useState(false)
  const [mostrarParticulas, setMostrarParticulas] = useState(false)
  const [coordenadasParticulas, setCoordenadasParticulas] = useState<{ x: number; y: number }>({ x: width/2, y: height/2 })
  const tiempoParticulas = 1200

  const navigation = useNavigation()

  const animacionMov = useRef(new Animated.Value(-400)).current
  const animacionOpacidad = useRef(new Animated.Value(0)).current

  const logoColectivo = require ('./src/logoColectivo.png')
  const [modalSalirVisible, setModalSalirVisible] = useState(false)

  const [tarjetas, setTarjetas] = useState<Carta[]>([])
  const [giros, setGiros] = useState<number[]>([])
  const angulo = 5

  const iniciarConfetti = () => {
    setMostrarConfetti(true)
    setTimeout(() => setMostrarConfetti(false), 10000)
  }

  const iniciarParticulas = () => {
    setMostrarParticulas(true)
    setTimeout(() => setMostrarParticulas(false), tiempoParticulas+(tiempoParticulas*0.4))
  }

  const controllerNoSalir = () => {setModalSalirVisible(false)}
  const controllerSalir = () => {
    setModalSalirVisible(false)
    navigation.goBack()
  }

  const okay = () => {setModalActivado(false)}
  const error = () => {setStatus (-1)}
  const aInicio = () => {setStatus (0)}
  const play = () => {setStatus (1)}
  const continuar = () => {setStatus (2)}
  const finalizar = () => {setStatus (9)}
  const cargando = () => {setStatus (-2)}

  type Carta = {
    idPareja: number
    emocion: string
    imagen: ImageSourcePropType
  }

  const cartas: Carta[] = [
    {
      idPareja: 1,
      emocion:"Felicidad",
      imagen: require('./src/icons/parejas/Felicidad.jpg'),
    },
    {
      idPareja: 3,
      emocion:"Enojo",
      imagen: require('./src/icons/parejas/Enojo.jpg'),
    },
    {
      idPareja: 5,
      emocion:"Ira",
      imagen: require('./src/icons/parejas/Ira.jpg'),
    },
    {
      idPareja: 7,
      emocion:"Sorpresa",
      imagen: require('./src/icons/parejas/Sorpresa.jpg'),
    },
    {
      idPareja: 9,
      emocion:"Tristeza",
      imagen: require('./src/icons/parejas/Felicidad.jpg'),
    },
    {
      idPareja: 11,
      emocion:"Asco",
      imagen: require('./src/icons/parejas/Felicidad.jpg'),
    },
    {
      idPareja: 13,
      emocion:"Preocupación",
      imagen: require('./src/icons/parejas/Felicidad.jpg'),
    },
    {
      idPareja: 15,
      emocion:"Tranquilidad",
      imagen: require('./src/icons/parejas/Felicidad.jpg'),
    },
    {
      idPareja: 17,
      emocion:"Admiración",
      imagen: require('./src/icons/parejas/Felicidad.jpg'),
    },
    {
      idPareja: 19,
      emocion:"Vergüenza",
      imagen: require('./src/icons/parejas/Felicidad.jpg'),
    }
  ]

  const tareaTerminada = async () => {
    navigation.goBack()
  }

  useEffect(() => {
    Orientation.lockToPortrait()
    return () => {Orientation.unlockAllOrientations()}
  }, [])

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        setModalSalirVisible(true)
        return true
      }
      BackHandler.addEventListener('hardwareBackPress', onBackPress)

      return () => {BackHandler.removeEventListener('hardwareBackPress', onBackPress)}
    }, [])
  )

  useEffect(() => {
    animacionMov.setValue(0)
    animacionOpacidad.setValue(0)
    switch(status){
      case 0:{
        animacionMov.setValue(0)
        animacionOpacidad.setValue(0)

        Animated.parallel([
          Animated.timing(animacionMov, {toValue: 0, duration: 400, useNativeDriver: true}),
          Animated.timing(animacionOpacidad, {toValue: 1, duration: 400, useNativeDriver: true})
        ]).start(() => {})
      }
      case 1:{
        animacionMov.setValue(0)
        animacionOpacidad.setValue(0)

        Animated.parallel([
          Animated.timing(animacionMov, {toValue: 0, duration: 400, useNativeDriver: true}),
          Animated.timing(animacionOpacidad, {toValue: 1, duration: 400, useNativeDriver: true})
        ]).start(() => {})

        inicializar()
      }
      case 9:{
        animacionMov.setValue(0)
        animacionOpacidad.setValue(0)

        Animated.parallel([
          Animated.timing(animacionMov, {toValue: 0, duration: 400, useNativeDriver: true}),
          Animated.timing(animacionOpacidad, {toValue: 1, duration: 400, useNativeDriver: true})
        ]).start(() => {})
      }
    }
  }, [status])

  const victoria = () => {
    finalizar()
    iniciarConfetti()
    playSound("victoria")
  }

  const inicializar = () => {
    let giromatico: React.SetStateAction<number[]> = ([])
    let seleccionadas = [...cartas].sort(() => Math.random() - 0.5).slice(0, 6)
    let duplicado = seleccionadas.map((tarjeta) => ({...tarjeta,idPareja: tarjeta.idPareja + 1}))
    let barajadas = [...seleccionadas, ...duplicado].sort(() => Math.random() - 0.5)
    setTarjetas(barajadas)

    tarjetas.forEach((tarjeta)=>{
      giromatico.push(Math.random()*angulo)
    })

    setGiros(giromatico)
    console.log(giros)
  }

  return (
    status ==-2 ? (
      <Loader loading={true}/>
    ) : ( status == 1) ? (
      <Animated.View 
        style={[
            estilos.contenedorGeneral, {
              transform:[{translateX: animacionMov}, {translateY: animacionMov}],
              opacity:animacionOpacidad}]}>
        <ModalSalir
          modalSalirVisible = {modalSalirVisible}
          controllerNoSalir = {controllerNoSalir}
          controllerSalir = {controllerSalir}>
        </ModalSalir>
        <ReactNativeModal
          backdropOpacity={modalActivado ? 0.5 : 0}
          isVisible={modalActivado}
          animationIn={'fadeIn'}
          animationOut={'fadeOut'}
          style={estilos.modalContenedor}>
          <View style={estilos.modalContenido}>
            <Image source={logoColectivo} style={estilos.logoModal} resizeMode='cover'></Image>
            <Text style={estilos.encabezado}>{encabezado}</Text>
            <Text style={estilos.descripcion}>{descripcion}</Text>
            <TouchableOpacity style={estilos.botonModal} onPress={okay}>
              <Text style={estilos.botonModalTexto}>{botonModalTexto}</Text>
            </TouchableOpacity>
          </View>
        </ReactNativeModal>

        <ReactNativeModal
          coverScreen = {false}
          animationInTiming = {1000}
          animationOutTiming = {500}
          backdropOpacity= {0}
          isVisible={tostadaActivada}
          animationIn={'fadeInUp'}
          animationOut={'fadeOutDown'}
          style={estilos.modalContenedor}
        >
          <View style={estilos.tostadaContenido}>
            <Text style={estilos.tostadaEncabezado}>{"¡!"}</Text>
          </View>
        </ReactNativeModal>

        {mostrarParticulas && (
          <Particles 
            origin={coordenadasParticulas}
            count={20}
            minSize={5} 
            maxSize={15} 
            spread={300}  
            duration={tiempoParticulas}  
            color="white"
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99999 }}
          />
        )}

        <View style={estilos.contenedor}>
          <View style={estilos.cabecera}>
            <TouchableOpacity onPress={() => setModalSalirVisible(true)}>
              <View style={estilos.salirContenedor}>
                <Text style={estilos.salirContenedorContenido}>X</Text>
              </View>
            </TouchableOpacity>
            <View style = {estilos.cabeceraContenedorDerecha}>
              <Text style={estilos.textoCabeceraStatus}>
                {""}
              </Text>
            </View>
          </View>

          <View style={estilos.cuerpo}>
            <View style={estilos.cartaContenedor}>

              {tarjetas.map(tarjeta => (
                <Animated.View key={tarjeta.idPareja} style={estilos.carta}>
                  <Image source={tarjeta.imagen} style={estilos.cartaImagen} resizeMode='cover'></Image>
                  <Text style={estilos.cartaTexto}>{tarjeta.emocion}</Text>                
                </Animated.View>
              ))}

            </View>
          </View>

          <View style={estilos.pieContenedor}>
          </View>
        </View>
      </Animated.View>
    ) : (status == 9) ? (
      <Animated.View 
        style={[
            estilos.contenedorFull, {
              transform:[{translateX: animacionMov}, {translateY: animacionMov}],
              opacity:animacionOpacidad
            }]}>
        {mostrarConfetti && (
          <View style={estilos.confetti}>
            <ConfettiCannon
              count={75}
              origin={{ x: width/4, y: -25 }}
              fallSpeed={3000}
              autoStart={true}
              explosionSpeed={350}
              fadeOut={true}
              autoStartDelay={0}>
            </ConfettiCannon>
            <ConfettiCannon
              count={75}
              origin={{ x: 2*width/3, y: -25 }}
              fallSpeed={3000}
              autoStart={true}
              explosionSpeed={350}
              fadeOut={true}
              autoStartDelay={0}>
            </ConfettiCannon>
          </View>
        )}
        <Image source={logoColectivo} style={estilos.logoColectivo} resizeMode='cover'></Image>
        <Text style={estilos.tituloFullTexto}>¡Felicidades! 🎉</Text>
        <Text style={estilos.tituloObjetivoTexto}>¡Has terminado el juego!</Text>
        <Text style={estilos.tituloObjetivoTexto}>{}</Text>
        <Text style={estilos.tituloObjetivoTexto}>{}</Text>
        <Text style={estilos.tituloFullTexto}>
          {""}
        </Text>
        <TouchableOpacity style={estilos.botonEmpezarContainer} onPress={tareaTerminada}>
          <View style={estilos.botonEmpezar}>
            <Text style={estilos.botonEmpezarTexto}>Finalizar</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    ) : status == 0 ? (
      <Animated.View 
        style={[
            estilos.contenedorFull, {
              transform:[{translateX: animacionMov}, {translateY: animacionMov}],
              opacity:animacionOpacidad
            }]}>
        <Image source={logoColectivo} style={estilos.logoColectivo} resizeMode='cover'></Image>
        <Text style={estilos.tituloFullTexto}>{"¡EmotiMatch!"}</Text>
        <Text style={estilos.tituloObjetivoTexto}>{"¡Descubre las emociones detras de las tarjetas!"}</Text>
        <TouchableOpacity style={estilos.botonEmpezarContainer} onPress={play}>
          <View style={estilos.botonEmpezar}>
            <Text style={estilos.botonEmpezarTexto}>Empezar Juego</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    ) : (<View><Text>¡Ay! ¡Algo ha salido mal!</Text></View>)
  )
}

const estilos = StyleSheet.create({
  confetti: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    elevation: 10,
    pointerEvents: 'none'
  },
  contenedorGeneral: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: pC.blanco
  },

  contenedor: {
    width: '90%',
    height: '95%',
    flexDirection: 'column',
    backgroundColor: pC.blanco
  },

  cabecera: {
    alignItems: 'flex-start',
    justifyContent: 'center'
  },

  textoCabeceraStatus: {
    textAlign:"right",
    fontSize:20
  },

  salirContenedor: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: '5%',
    paddingVertical: '2%',
    marginVertical: 10,
    width: 55,
    height:55,
    borderRadius: 10,
    backgroundColor: pC.primario.DEFAULT + pC.transparencia[30]
  },

  salirContenedorContenido: {
    fontSize: 30,
    fontWeight: 'bold',
    color: pC.primario.DEFAULT
  },

  cabeceraContenedorDerecha:{},

  cuerpo: {
    flex: 1,
    marginTop: 10,
  },
  cartaContenedor: {
    backgroundColor: "red",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: 'row',
    flexWrap: 'wrap',
    width:"100%",
  },

  carta: {
    backgroundColor: pC.terciario.claro,
    width: 100,
    height: 135,
    margin: 7,
    borderRadius: 10,
    borderColor:pC.blanco,
    borderWidth: 5
  },

  cartaImagen: {
    marginTop: 5,
    width: 85,
    height: 85,
    borderRadius: 50,
    alignSelf: 'center',
  },
  
  cartaTexto: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
    paddingTop:10
  },

  pieContenedor: {
    height:"10%",
    alignItems:"center",
    bottom:"5%",
    start:"25%",
    justifyContent:"center",
    position:"absolute",
  },
  
  botonPie: {
    width:180,
    padding:20,
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 30,
    borderBottomRightRadius: 0,
    justifyContent:"center",
    alignItems:"center",
    position:"absolute",
    backgroundColor:pC.secundario.DEFAULT + pC.transparencia[85],
  },

  botonPieTexto: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'bold',
    color: pC.blanco
  },
  logoModal: {
    width: 160,
    height: 160,
    borderRadius: 100,
    position: 'absolute',
    bottom: '90%',
    alignSelf: 'center'
  },

  modalContenedor: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    position: 'relative',
    backgroundColor: 'transparent'
  },
  modalContenido: {
    backgroundColor: pC.primario.claro,
    justifyContent: 'space-between',
    flexDirection: 'column',
    alignContent: 'center',
    alignSelf: 'center',
    width: '90%',
    borderRadius: 20,
    marginTop: '30%',
    padding: 10,
    borderColor: pC.secundario.DEFAULT + pC.transparencia[50],
    borderWidth: 2
  },

  encabezado: {
    color: pC.blanco,
    margin: 15,
    marginTop: 50,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600'
  },

  descripcion: {
    color: pC.blanco,
    margin: 15,
    marginTop: 50,
    textAlign: 'center',
    fontSize: 10,
    paddingTop: 20,
    fontWeight: '600'
  },

  botonModal: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: pC.secundario.claro,
    width: '55%',
    paddingVertical: 15,
    margin: 5,
    marginBottom: 15,
    borderRadius: 10,
    borderColor: "white",
    borderWidth: 2
  },

  botonModalTexto: {
    color: pC.blanco,
    textAlign: 'center',
    fontWeight: 'bold'
  },

  tostadaContenido: {
    backgroundColor: pC.primario.claro + pC.transparencia[90],
    justifyContent: 'space-between',
    flexDirection: 'column',
    alignContent: 'center',
    alignSelf: 'center',
    marginTop: '20%',
    padding: 20,
    borderRadius: 20,
    borderColor: pC.secundario.DEFAULT + pC.transparencia[50],
    borderWidth: 2
  },

  tostadaEncabezado: {
    color: pC.blanco,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600'
  },

  contenedorFull: {
    borderRadius: 20,
    paddingHorizontal: 20,
    width: '90%',
    margin: '5%',
    backgroundColor: pC.terciario.claro + pC.transparencia[50],
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  tituloFullTexto: {
    textAlign: 'center',
    margin: '5%',
    color: pC.primario.DEFAULT,
    fontSize: 25,
    fontWeight: 'bold'
  },

  logoColectivo: {
    width: 200,
    height: 200,
    borderRadius: 50,
    marginBottom: 40
  },

  tituloObjetivoTexto: {
    textAlign: 'center',
    color: pC.primario.DEFAULT,
    fontSize: 15,
    fontWeight: 'normal'
  },

  botonEmpezarContainer: {
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },

  botonEmpezar: {
    width: 180,
    padding: 20,
    borderRadius: 50,
    backgroundColor: pC.primario.DEFAULT,
    justifyContent: 'center',
    alignItems: 'center'
  },

  botonEmpezarTexto: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'bold',
    color: pC.blanco
  }
})

export default Parejas
