import React, { useEffect, useRef, useState } from 'react'
import { View, Text, StyleSheet, Animated, ActivityIndicator, FlatList, TouchableOpacity, Image, BackHandler, Dimensions } from "react-native"
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import ReactNativeModal from "react-native-modal"
import { useToast } from 'react-native-toast-notifications'
import Loader from '@ui/components/Loader'
import { getTrivia } from '@services/GetTrivias.service'
import { ModalSalir } from "./src/components/modalSalir"
import pC from './src/theme/colores'
import ConfettiCannon from 'react-native-confetti-cannon'
import Orientation from 'react-native-orientation-locker'
import {playSound, stopSound} from "./src/components/Audio"

const { width, height } = Dimensions.get('window')

const Trivia = () => {
  const toast = useToast()
  const [mostrarConfetti, setMostrarConfetti] = useState(false)
  const [modalActivado, setModalActivado] = useState<boolean>(false)
  const [botonValidar, setBotonValidar] = useState<boolean>(false)
  const [correctas, setCorrectas] = useState<number>(0)
  const [textoCorrecta, setTextoCorrecta] = useState<string>('')
  const [desabilitado, setDesabilitado] = useState<any[]>([])
  const [seleccionado, setSeleccionado] = useState<any[]>([])
  const [trivia, setTrivia] = useState<any>({})
  const [preguntaNumero, setPreguntaNumero] = useState<number>(-1)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [cantPreguntas, setCantPreguntas] = useState<number>(0)
  const [preguntas, setPreguntas] = useState<any[]>([])
  const [cantRespuestas, setCantRespuestas] = useState<number>(0)
  const [fontSize, setfontSize] = useState(16)
  const route = useRoute()
  const navigation = useNavigation()

  const animacionMov = useState(new Animated.Value(-400))[0]
  const animacionOpacidad = useState(new Animated.Value(0))[0]  
  const animacionOpacidadFin = useState (new Animated.Value(0))[0]
  const { idTrivia }: any = route.params || {}
  const logoColectivo = require ('./src/logoColectivo.png')

  const [modalSalirVisible, setModalSalirVisible] = useState(false)
  const animacionBoton = useRef(new Animated.Value(0)).current
  const opacidadBoton = useRef(new Animated.Value(0)).current


  const redimTexto = (event: any) => {
    const { width, height } = event.nativeEvent.layout
    setfontSize(Math.min(width, height) / 5)}

    const controllerSalir = () => {
      setModalSalirVisible(false)
      navigation.goBack()
    }
    const iniciarConfetti = () => {
      setMostrarConfetti(true)
      //setTimeout(() => setMostrarConfetti(false), 10000)
    }
    
  const controllerNoSalir = () => {setModalSalirVisible(false)}

  const obtenerDatos = async () => {
    try {
      const resultado = await getTrivia(idTrivia)
      setTrivia(resultado.data)
      setPreguntas(resultado.data.questions || [])
      setCantPreguntas(Object.keys(resultado.data.questions || {}).length)
      setPreguntaNumero(-1)
    } catch (error) {
      toast.show('No se pudo obtener el juego.', {
        type: 'danger',
        placement: 'top',
        duration: 4000,
        animationType: 'slide-in'
      })
    } finally {
      setIsLoading(false)
    }
  }

useEffect(() => {
  Orientation.lockToPortrait()
  obtenerDatos()

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
  Animated.parallel([
    Animated.timing(animacionBoton, {
      toValue: botonValidar ? 50 : 100,
      duration: 300,
      useNativeDriver: true
    }),
    Animated.timing(opacidadBoton, {
      toValue: botonValidar ? 1 : 0.5,
      duration: 300,
      useNativeDriver: true
    })
  ]).start()
}, [botonValidar])

  const tareaTerminada = async () => {
    navigation.goBack()
  }

  const siguiente = () => {
    setModalActivado(false)
    setMostrarConfetti(false)
    if (preguntaNumero < cantPreguntas-1) {
      Animated.parallel([
        Animated.timing(animacionMov, { toValue: -500, duration: 400, useNativeDriver: true }),
        Animated.timing(animacionOpacidad, { toValue: 0, duration: 400, useNativeDriver: true })
      ]).start(() => {
        setDesabilitado([])
        setSeleccionado([])
        setCorrectas(0)
        getCantRespuestas()
        animacionMov.setValue(500)
        animacionOpacidad.setValue(0)
        Animated.parallel([
          Animated.timing(animacionMov, { toValue: 0, duration: 400, useNativeDriver: true }),
          Animated.timing(animacionOpacidad, { toValue: 1, duration: 400, useNativeDriver: true })
        ]).start()
      })
      setPreguntaNumero(preguntaNumero + 1)
    } else {
      setPreguntaNumero(cantPreguntas)
      Animated.parallel([
        Animated.timing(animacionMov, { toValue: -500, duration: 400, useNativeDriver: true }),
        Animated.timing(animacionOpacidad, { toValue: 0, duration: 400, useNativeDriver: true })
      ]).start(() => {
        playSound("victoria")
        animacionMov.setValue(500)
        animacionOpacidad.setValue(0)
        Animated.parallel([
          Animated.timing(animacionMov, { toValue: 0, duration: 400, useNativeDriver: true }),
          Animated.timing(animacionOpacidadFin, { toValue: 1, duration: 400, useNativeDriver: true })
        ]).start(()=>{iniciarConfetti()})})
    }
  }

  const clicRespuesta = async (index: number) => {
    if (seleccionado.length == 0) {
      const arreglo = Array(trivia.questions[preguntaNumero]?.answers?.length || 0).fill(false)
      setSeleccionado(arreglo)
      setDesabilitado(arreglo)
    }

    const nuevosEstados_1 = await new Promise<any[]>(resolve => {
      setSeleccionado(prev => {
        const cantResp = getCantRespuestas()
        let nuevosEstados

        if (cantResp >= 1) {
          nuevosEstados = prev.map((estado, otros) => (otros === index ? !estado : false))
        } else {
          nuevosEstados = [...prev]
          nuevosEstados[index] = !nuevosEstados[index]
        }

        resolve(nuevosEstados)
        return nuevosEstados
      })
    })
    setBotonValidar(nuevosEstados_1.filter((valor) => valor === true).length > 0 ? true : false)
  }

  const getCantRespuestas = (numero = preguntaNumero) => {
    const cant = trivia.questions?.[numero]?.answers?.filter((respuesta: any) => respuesta.answer_option === 1).length || 0
    setCantRespuestas(cant)
    return cant
  }
  const validarRespuesta = () => {
    setBotonValidar(false)
    let correcta = true
    const respuestas = trivia.questions?.[preguntaNumero]?.answers || []
    const incorrectas = Array(respuestas.length).fill(false)
    const cant = respuestas.length

    for (let i = 0; i < cant; i++){
      if (seleccionado[i] && respuestas[i].answer_option == "1"){
        setTextoCorrecta(respuestas[i].answer_description)
      } else if (seleccionado[i]){incorrectas[i] = true}
    }

    for (let i = 0; i < cant; i++){
      if (seleccionado[i] && incorrectas[i]){
        const desab = desabilitado
        correcta = false
        desab[i] = true
        setDesabilitado(desab)
        setSeleccionado(Array(cant).fill(false))
      }
    }

    if (correcta) {
      setCorrectas(correctas + 1)
      setModalActivado(true)
      playSound("punto")
      iniciarConfetti()
    }
  }

  const empezartrivia = () => {
    setPreguntaNumero(0)
    siguiente()
  }

  const modalCorrecta = () => {
    correctas == cantRespuestas ? siguiente() : setModalActivado(false)
  }

  if (isLoading) {
    return <Loader loading={isLoading} />
  }

  return (
    <View style={estilos.contenedorGeneral}>
      {mostrarConfetti && (
        <View style={estilos.confetti}>
          <ConfettiCannon
            count={75}
            origin={{ x: width/3, y: -25 }}
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
        style={estilos.modalContenedor}
      >
        <View style={estilos.modalContenido}>
          <Image source={logoColectivo} style={estilos.logoModal} resizeMode='cover'></Image>
          <Text style={estilos.encabezado}>{textoCorrecta}</Text>
          <TouchableOpacity style={estilos.botonModal} onPress={modalCorrecta}>
            <Text style={estilos.botonModalTexto}>
              {correctas === cantRespuestas && preguntaNumero != (cantPreguntas-1) ? "Siguiente pregunta" : preguntaNumero == (cantPreguntas-1) ? "Finalizar" : "Aceptar"}
            </Text>
          </TouchableOpacity>
        </View>
      </ReactNativeModal>

      {preguntaNumero >= 0 && preguntaNumero < cantPreguntas ? (
        <View style={estilos.contenedor}>
          <View style={estilos.cabecera}>
            <TouchableOpacity onPress={() => setModalSalirVisible(true)}>
              <View style={estilos.salirContenedor}>
                <Text style={estilos.salirContenedorContenido}>X</Text>
              </View>
            </TouchableOpacity>
          </View>

          <Animated.View style={[estilos.cuerpo, { transform: [{ translateX: animacionMov }], opacity: animacionOpacidad }]}>
            <View style={estilos.preguntaContenedor}>
              <View style={estilos.progresoContenedor}>
                <View style={estilos.progresoTextoContenedor}>
                  <Text style={estilos.progresoTexto}>{preguntaNumero + 1} / {cantPreguntas}</Text>
                </View>
                <View style={estilos.barraProgresoContenedor}>
                  <View style={estilos.barraProgresoFondo}>
                    <View 
                      style={[estilos.barraProgreso, 
                      { width: `${((preguntaNumero + 1) / cantPreguntas) * 100}%`,
                        backgroundColor: pC.terciario.claro + pC.transparencia[70 + Math.round(((preguntaNumero + 1) / cantPreguntas) * 30 / 5) * 5]
                      }]}>
                    </View>
                  </View>
                </View>
              </View>
              <View style={estilos.preguntaContenedorTexto} onLayout={redimTexto}>
                <Text style={[estilos.pCTT,{fontSize}]}>{preguntas[preguntaNumero].question_name}</Text>
              </View>
            </View>
            {cantRespuestas > 1 ? <Text style={estilos.pCTTCh}>Hay más de una respuesta</Text> : null}
            <View style={estilos.respuestasContenedor}>
              <View style={estilos.respuestasLista}>
                <FlatList
                  contentContainerStyle={{ paddingBottom: 20 }}
                  data={trivia.questions[preguntaNumero].answers}
                  keyExtractor={item => item.id}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity
                      activeOpacity={0.80}
                      disabled={desabilitado[index]}
                      style={[
                        estilos.respuesta,
                        desabilitado[index] && { backgroundColor: pC.primario.claro + pC.transparencia[50] },
                        seleccionado[index] && { backgroundColor: pC.primario.oscuro }
                      ]}
                      onPress={() => {clicRespuesta(index)}}>
                      <Text style={estilos.respuestaTexto}>{item.answer_name}</Text>
                    </TouchableOpacity>
                  )}
                ></FlatList>
              </View>
            </View>
            <View style={estilos.pieContenedor}>
              <Animated.View
                pointerEvents="box-none"
                style={[
                  { transform: [{ translateY: animacionBoton }], opacity: opacidadBoton }
                ]}
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  disabled={!botonValidar}
                  onPress={validarRespuesta}
                  style={estilos.botonPie}
                >
                  <Text style={estilos.botonPieTexto}>Validar</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </Animated.View>
        </View>
      ) : preguntaNumero < 0 ? (
        <View style={estilos.contenedorFull}>
          <Image source={logoColectivo} style={estilos.logoColectivo} resizeMode='cover'></Image>
          <Text style={estilos.tituloFullTexto}>{trivia.trivia_name}</Text>
          <Text style={estilos.tituloObjetivoTexto}>{trivia.trivia_objective}</Text>
          <TouchableOpacity style={estilos.botonEmpezarContainer} onPress={empezartrivia}>
            <View style={estilos.botonEmpezar}>
              <Text style={estilos.botonEmpezarTexto}>Empezar trivia</Text>
            </View>
          </TouchableOpacity>
        </View>
      ) : (
        <Animated.View style={[estilos.contenedorFull, { opacity: animacionOpacidadFin }]}>
          <Image source={logoColectivo} style={estilos.logoColectivo} resizeMode='cover'></Image>
          <Text style={estilos.tituloFullTexto}>¡Felicidades! 🎉</Text>
          <Text style={estilos.tituloObjetivoTexto}>¡Has terminado la trivia!</Text>
          <TouchableOpacity style={estilos.botonEmpezarContainer} onPress={tareaTerminada}>
            <View style={estilos.botonEmpezar}>
              <Text style={estilos.botonEmpezarTexto}>Finalizar trivia</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
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
    marginTop: 20,
  },

  preguntaContenedor: {
    alignItems: 'center',
    width: '100%',
    height: '25%',
    backgroundColor: pC.primario.DEFAULT + pC.transparencia[50],
    borderRadius: 30,
    padding: 20,
  },

  progresoContenedor: {
    width: '100%',
    height: '30%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },

  progresoTextoContenedor: {
    width: '25%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  progresoTexto: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    alignSelf: 'center',
    color: pC.blanco
  },

  barraProgresoContenedor: {
    width: '75%',
    height: '100%',
    justifyContent: 'center',
    padding: 10
  },

  barraProgresoFondo: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    backgroundColor: pC.primario.oscuro
  },

  barraProgreso: {
    height: '100%',
    borderRadius: 20,
  },

  preguntaContenedorTexto: {
    justifyContent: 'center',
    width: '100%',
    height: '70%',
    margin:5
  },

  pCTT: {
    fontSize: 20,
    textAlign: 'center',
    color: pC.blanco,
    fontWeight: 'bold'
  },

  pCTTCh: {
    textAlign: 'center',
    color: pC.primario.claro,
    fontWeight: '500'
  },

  respuestasContenedor: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  respuestasLista: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  respuesta: {
    margin:10,
    backgroundColor: pC.primario.DEFAULT + pC.transparencia[90],
    borderRadius: 10,
    padding: 15,
    minWidth:"85%",
    maxWidth:"85%",
    flex:1,
    alignSelf: 'center',
    alignItems: 'center'
  },

  respuestaTexto: {
    maxWidth: 225,
    fontSize: 15,
    fontWeight: '500',
    color: pC.blanco,
    textAlign: 'center'
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
  }
})

export default Trivia
