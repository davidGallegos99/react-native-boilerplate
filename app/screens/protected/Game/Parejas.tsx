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
  const [logoModal, setLogoModal] = useState<ImageSourcePropType>(require ('./src/logoColectivo.png'))
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
  const atras = require ('./src/icons/parejas/atras.png')
  const [modalSalirVisible, setModalSalirVisible] = useState(false)

  const [tarjetas, setTarjetas] = useState<Carta[]>([])
  const [giros, setGiros] = useState<number[]>([])
  const [anguloMin, anguloMax] = [-5,5]
  const [girosAnimados, setGirosAnimados] = useState<{ [key: number]: Animated.Value }>({})
  const [mostrandoCara, setMostrandoCara] = useState<boolean[]>([]) 
  const [contadorCartas, setContadorCartas] = useState<number>(0) 
  const [primeraCarta, setPrimeraCarta] = useState<number>(-1) 
  const [primeraCartaI, setPrimeraCartaI] = useState<number>(-1) 
  const [encontrada, setEncontrada] = useState<boolean[]>([]) 
  const [bloqueoInput, setBloqueoInput] = useState(false)
  const bloqueoRef = useRef(false)
  const timerRef = useRef(0)
  const [displayTimer, setDisplayTimer] = useState(0)
  const [enMarcha, setEnMarcha] = useState<boolean>(false)

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

  const okay = () => {
    setModalActivado(false)
    if(encontrada.every(Boolean)) {victoria()}
  }
  const error = () => {setStatus (-1)}
  const aInicio = () => {setStatus (0)}
  const continuar = () => {setStatus (2)}
  const finalizar = () => {setStatus (9)}
  const cargando = () => {setStatus (-2)}

  const play = () => {
    Animated.parallel([
      Animated.timing(animacionMov, { toValue: 0, duration: 400, useNativeDriver: true }),
      Animated.timing(animacionOpacidad, { toValue: 1, duration: 400, useNativeDriver: true })
    ]).start(() => {
      setStatus(1)
      inicializar()
    })
  }
  

  type Carta = {
    idPareja: number
    emocion: string
    definicion: string
    imagen: ImageSourcePropType
  }

  const cartas: Carta[] = [
    {
      idPareja: 1,
      emocion: "Felicidad",
      definicion: "La felicidad es una emoción positiva que refleja bienestar, satisfacción y alegría ante situaciones placenteras o logros personales.",
      imagen: require('./src/icons/parejas/Felicidad.jpg'),
    },
    {
      idPareja: 3,
      emocion: "Enojo",
      definicion: "El enojo es una respuesta emocional a la frustración o a una situación percibida como injusta, que puede generar irritabilidad y tensión.",
      imagen: require('./src/icons/parejas/Enojo.jpg'),
    },
    {
      idPareja: 5,
      emocion: "Ira",
      definicion: "La ira es una emoción intensa caracterizada por el enfado extremo, que puede surgir ante una amenaza o una injusticia y motivar la defensa o confrontación.",
      imagen: require('./src/icons/parejas/Ira.jpg'),
    },
    {
      idPareja: 7,
      emocion: "Sorpresa",
      definicion: "La sorpresa es una reacción espontánea ante lo inesperado, que puede ser positiva o negativa, generando asombro y una respuesta rápida de adaptación.",
      imagen: require('./src/icons/parejas/Sorpresa.jpg'),
    },
    {
      idPareja: 9,
      emocion: "Tristeza",
      definicion: "La tristeza es una emoción que surge ante la pérdida, el desánimo o la frustración, expresándose a menudo con llanto, melancolía o introspección.",
      imagen: require('./src/icons/parejas/Tristeza.jpg'),
    },
    {
      idPareja: 11,
      emocion: "Asco",
      definicion: "El asco es una emoción de rechazo o aversión ante algo desagradable, como olores, sabores o comportamientos moralmente inaceptables.",
      imagen: require('./src/icons/parejas/Asco.jpg'),
    },
    {
      idPareja: 13,
      emocion: "Preocupación",
      definicion: "La preocupación es un estado de inquietud o ansiedad sobre un problema o situación futura, que genera pensamientos constantes y tensión emocional.",
      imagen: require('./src/icons/parejas/Preocupacion.jpg'),
    },
    {
      idPareja: 15,
      emocion: "Tranquilidad",
      definicion: "La tranquilidad es un estado de calma y paz interior, caracterizado por la ausencia de estrés o ansiedad, que permite la relajación y el bienestar.",
      imagen: require('./src/icons/parejas/Tranquilidad.jpg'),
    },
    {
      idPareja: 17,
      emocion: "Admiración",
      definicion: "La admiración es un sentimiento de aprecio y respeto hacia algo o alguien que se percibe como excepcional o inspirador.",
      imagen: require('./src/icons/parejas/Admiracion.jpg'),
    },
    {
      idPareja: 19,
      emocion: "Vergüenza",
      definicion: "La vergüenza es una emoción que surge al sentirse expuesto o juzgado negativamente por otros, provocando incomodidad y deseo de ocultarse.",
      imagen: require('./src/icons/parejas/Verguenza.jpg'),
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
    let nuevosGiros: { [key: number]: Animated.Value } = {};
    tarjetas.forEach((_, index) => {nuevosGiros[index] = new Animated.Value(0)})
    setGirosAnimados(nuevosGiros)
  }, [tarjetas])

  useEffect(() => {
      let intervalo: NodeJS.Timeout
      if (enMarcha) {
        intervalo = setInterval(() => {
          timerRef.current += 1
          setDisplayTimer(timerRef.current)
        }, 1000)
      }
  
      return () => {clearInterval(intervalo)}
    }, [enMarcha])

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
        ]).start(() => {inicializar()})
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
    let seleccionadas = [...cartas].sort(() => Math.random() - 0.5).slice(0, 6)
    let duplicado = seleccionadas.map((tarjeta) => ({...tarjeta,idPareja: tarjeta.idPareja + 1}))
    let barajadas = [...seleccionadas, ...duplicado].sort(() => Math.random() - 0.5)
    setTarjetas(barajadas)

    setMostrandoCara(Array(barajadas.length).fill(false))
    setEncontrada(Array(barajadas.length).fill(false))
    setGiros(barajadas.map(() => Math.random() * (anguloMax - anguloMin) + anguloMin))

    let girosIniciales: { [key: number]: Animated.Value } = {}
    tarjetas.forEach((tarjeta, index) => {girosIniciales[index] = new Animated.Value(0)})
    setGirosAnimados(girosIniciales)
    setEnMarcha(true)
  }

  const girarTarjeta = (index: number, callback?: () => void) => {
    if (!girosAnimados[index]) return
    Animated.timing(girosAnimados[index], {
      toValue: mostrandoCara[index] ? 0 : 1,
      duration: 500,
      useNativeDriver: true
    }).start(()=>{
      const nuevasCaras = mostrandoCara
      nuevasCaras[index] = !nuevasCaras[index]
      setMostrandoCara(nuevasCaras)
      if (callback) callback()
    })
  }

  const girarTarjetas = (index1: number, index2: number, callback?: () => void) => {
    if (!girosAnimados[index1] || !girosAnimados[index2]) return
  
    Animated.parallel([
      Animated.timing(girosAnimados[index1], {
        toValue: mostrandoCara[index1] ? 0 : 1,
        duration: 400,
        useNativeDriver: true
      }),
      Animated.timing(girosAnimados[index2], {
        toValue: mostrandoCara[index2] ? 0 : 1,
        duration: 400,
        useNativeDriver: true
      })
    ]).start(() => {
      const nuevasCaras = mostrandoCara
      nuevasCaras[index1] = !nuevasCaras[index1]
      nuevasCaras[index2] = !nuevasCaras[index2]
      setMostrandoCara(nuevasCaras)
      if (callback) callback()
    })
  }  

  const comprobarClic = (indice: number) => {
    const actual = tarjetas[indice].idPareja

    if (bloqueoRef.current || indice === primeraCartaI || encontrada[indice]) return
    bloqueoRef.current = true

    setContadorCartas(prevContador => {
      const nuevoContador = prevContador + 1

      if (nuevoContador === 1) {
        setPrimeraCarta(actual)
        setPrimeraCartaI(indice)
        girarTarjeta(indice)
        bloqueoRef.current = false
      } else if (nuevoContador === 2) {
        girarTarjeta(indice, () => {
          const esParejaCorrecta = Math.abs(primeraCarta - actual) === 1 && Math.min(primeraCarta, actual) % 2 === 1
          if (esParejaCorrecta) {
            let encontradaTemp = [...encontrada]
            encontradaTemp[primeraCartaI] = true
            encontradaTemp[indice] = true
            
            setEncontrada(encontradaTemp)
            setPrimeraCarta(-1)
            setPrimeraCartaI(-1)
            setContadorCartas(0)
            bloqueoRef.current = false

            setLogoModal(tarjetas[indice].imagen)
            setEncabezado("¡Excelente! ¡Has encontrado una nueva emoción!")
            setDescripcion(tarjetas[indice].definicion)
            setBotonModalTexto("¡De acuerdo!")
            setModalActivado(true)
            playSound("punto")
            
            setTimeout(() => {
              iniciarParticulas()
            }, 200)
          } else {
            setTimeout(() => {
              girarTarjetas(primeraCartaI, indice, () => {
                setPrimeraCarta(-1)
                setPrimeraCartaI(-1)
                setContadorCartas(0)
              })}, 500)
            setTimeout(()=>bloqueoRef.current = false, 200)
          }
        })
      }
      return nuevoContador
    })
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
            <Image source={logoModal} style={estilos.logoModal} resizeMode='cover'></Image>
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
              {tarjetas.map((tarjeta, index) => {
                const interpolacionRotacion = girosAnimados[index]?.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '180deg']
                }) || '0deg'

                const interpolacionZoom = girosAnimados[index]?.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.1]
                }) || 1

                const opacityFront = girosAnimados[index]?.interpolate({
                  inputRange: [0, 0.5],
                  outputRange: [1, 0],
                  extrapolate: 'clamp'
                }) || 1

                const opacityBack = girosAnimados[index]?.interpolate({
                  inputRange: [0.5, 1],
                  outputRange: [0, 1],
                  extrapolate: 'clamp'
                }) || 0

                return (
                  <TouchableOpacity disabled={encontrada[index] || bloqueoRef.current} key={index} onPress={() => comprobarClic(index)}
                    style={{ transform: [{ rotate: `${giros[index]}deg` }], opacity: encontrada[index] ? 0 : 1 }}>
                    <Animated.View style={[estilos.carta,{transform: [{ rotateY: interpolacionRotacion }, { scale: interpolacionZoom }]}]}>
                      <Animated.View style={{ 
                          opacity: opacityFront, 
                          position: "absolute",
                          backfaceVisibility: 'hidden', 
                          width: '100%', 
                          height: '100%',
                          zIndex: mostrandoCara[index] ? 2 : 0
                      }}>
                        <Image source={atras} style={estilos.cartaImagenAtras} resizeMode='cover' />
                      </Animated.View>
                      <Animated.View style={{ 
                          opacity: opacityBack, 
                          position: "absolute", 
                          backfaceVisibility: 'visible', 
                          width: '100%', 
                          height: '100%',
                          zIndex: mostrandoCara[index] ? 0 : 2,
                          transform: [{ rotateY: '180deg' }] 
                      }}>
                        <Image source={tarjeta.imagen} style={estilos.cartaImagen} resizeMode='cover' />
                        <Text style={estilos.cartaTexto}>{tarjeta.emocion}</Text>
                      </Animated.View>
                    </Animated.View>
                  </TouchableOpacity>
                )
              })}
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: 'row',
    flexWrap: 'wrap',
    width:"100%",
  },

  carta: {
    backgroundColor: pC.terciario.claro,
    width: 110,
    height: 145,
    margin: 2,
    borderRadius: 10,
    borderColor:pC.terciario.DEFAULT,
    borderWidth: 5
  },

  cartaImagenAtras: {
    marginTop: 25,
    width: 85,
    height: 85,
    alignSelf: 'center',
  },

  cartaImagen: {
    marginTop: 7,
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
    fontSize: 20,
    paddingTop: 10,
    fontWeight: 'bold'
  },

  descripcion: {
    color: pC.primario.DEFAULT,
    marginHorizontal: 15,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '500',
    backgroundColor:pC.blanco + pC.transparencia[50],
    borderRadius: 15,
    padding: 15
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
    borderColor: pC.blanco,
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
