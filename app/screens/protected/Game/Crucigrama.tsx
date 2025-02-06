import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { View, Text, Button, StyleSheet, Animated, ActivityIndicator, FlatList, TouchableOpacity, Image, BackHandler, Dimensions } from "react-native"
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import ReactNativeModal from "react-native-modal"
import Loader from '@ui/components/Loader'
import { GestureDetector, Gesture } from "react-native-gesture-handler"
import { runOnJS, useSharedValue } from 'react-native-reanimated'
import { ModalSalir } from "./src/components/modalSalir"
import pC from './src/theme/colores'
import Orientation from 'react-native-orientation-locker'
import ConfettiCannon from 'react-native-confetti-cannon'
import Particles from './src/components/Particulas'
import {playSound, stopSound} from "./src/components/Audio"

const tamCelda = 34
const bordeCelda = 1
const { width, height } = Dimensions.get('window')

const Crucigrama = () => {
  const [mostrarConfetti, setMostrarConfetti] = useState(false)
  const navigation = useNavigation()
  const logoColectivo = require ('./src/logoColectivo.png')
  const [modalSalirVisible, setModalSalirVisible] = useState<boolean>(false)
  const [status, setStatus] = useState(-2)
  const [modalActivado, setModalActivado] = useState<boolean>(false)

  const tam = 10
  const timerRef = useRef(0)
  const [displayTimer, setDisplayTimer] = useState(0)
  const [enMarcha, setEnMarcha] = useState<boolean>(false)

  const [tabla, setTabla] = useState<string[][]>(Array.from({ length: tam }, () => Array(tam).fill("x")))
  const [contenedorPos, setContenedorPos] = useState({ x: 0, y: 0 })

  const [seleccionadas, setSeleccionadas] = useState(new Set())
  const seleccionadasRef = useRef<Set<string>>(new Set())

  const animacionMov = useRef(new Animated.Value(-400)).current
  const animacionOpacidad = useRef(new Animated.Value(0)).current
  const [mostrarParticulas, setMostrarParticulas] = useState(false)
  const [coordenadasParticulas, setCoordenadasParticulas] = useState<{ x: number; y: number }>({ x: width/2, y: height/2 })
  const tiempoParticulas = 1200

  const [sobreCelda, setSobreCelda] = useState(new Set())
  const sobreCeldaRef = useRef<Set<string>>(new Set())
  const sobreCeldaTimer = useRef<NodeJS.Timeout | null>(null)

  let palabras = ['sexo', 'género', 'respeto', 'igualdad', 'diversidad', 'derechos', 'amor', 'libertad', 'consenso', 'cuidado', 'identidad', 'equidad', 'trans', 'lesbianas', 'bisexual', 'inclusión', 'orgullo', 'empoderar', 'feminismo', 'solidario', 'activismo', 'tolerancia', 'aceptación', 'visibilidad', 'dignidad', 'comunidad', 'valores', 'justicia', 'autonomía', 'educación', 'reconocer', 'protección', 'apoyo', 'colectivo', 'fraternidad', 'seguridad', 'sororidad', 'espectro', 'diverso', 'pride', 'lucha', 'acción', 'aceptar', 'hermandad', 'justo', 'fuerte', 'poder', 'libre', 'único', 'proteger', 'rebelde', 'voz', 'cambio', 'ser', 'gay', 'unidad', 'fraterna', 'pacífico', 'silencio', 'revolución', 'lesbiana', 'orgullosa', 'brillar', 'creer', 'educar', 'esperar', 'tolerar', 'fuerza', 'liderar', 'progreso', 'colectiva', 'inclusiva', 'respetar', 'volar', 'vibrar', 'latente']

  const [elegidas, setElegidas] = useState<string[]>([])
  const [elegidasRef, setElegidasRef] = useState<Set<string>>(new Set())
  const [restantes, setRestantes] = useState<number>(0)
  const [restantesDeselec, setRestantesDeselec] = useState<boolean[]>([])  

  const cargando = () => {setStatus (-2)}
  const aInicio = () => {setStatus (0)}
  const play = () => {setStatus (1)}
  const finalizar = () => {setStatus (9)}

  const iniciarParticulas = () => {
    setMostrarParticulas(true)
    setTimeout(() => setMostrarParticulas(false), tiempoParticulas+(tiempoParticulas*0.4))
  }

  const controllerSalir = () => {
    setModalSalirVisible(false)
    navigation.goBack()
  }

  const controllerNoSalir = () => {setModalSalirVisible(false)}

  const tareaTerminada = async () => {
    navigation.goBack()
  }

  const actualizarSeleccionTemporal = (fila: number, columna: number) => {
    seleccionadasRef.current.add(`${fila}-${columna}`)
  }

  const actualizarSobreCelda = (fila: number, columna: number) => {
    const key = `${fila}-${columna}`
    if (!sobreCeldaRef.current.has(key)) {
      sobreCeldaRef.current.add(key)
      if (!sobreCeldaTimer.current) {
        sobreCeldaTimer.current = setTimeout(() => {
          setSobreCelda(new Set(sobreCeldaRef.current))
          sobreCeldaTimer.current = null
        }, 25) 
      }
    }
  }

  const limpiarSobreCelda = () => {
    sobreCeldaRef.current.clear()
    setSobreCelda(new Set())
  }

  const finalizarSeleccion = useCallback(() => {  
    const celdasSeleccionadas = Array.from(seleccionadasRef.current)
    if (celdasSeleccionadas.length < 2) {
      seleccionadasRef.current.clear()
      return
    }
  
    const filas = celdasSeleccionadas.map(celda => parseInt(celda.split('-')[0]))
    const columnas = celdasSeleccionadas.map(celda => parseInt(celda.split('-')[1]))
  
    const esMismaFila = filas.every(fila => fila === filas[0])
    const esMismaColumna = columnas.every(columna => columna === columnas[0])
  
    if (esMismaFila || esMismaColumna) {
      if (esMismaColumna && filas[0] > filas[1]) filas.reverse()
      if (esMismaFila && columnas[0] > columnas[1]) columnas.reverse()
  
      const palabraSel = celdasSeleccionadas.map((_, i) => tabla[filas[i]][columnas[i]]).join("")
  
      if (elegidasRef.has(palabraSel)) {
        seleccionadasRef.current.clear()
  
        if (!modalActivado) {
          setModalActivado(true)
          setTimeout(() => setModalActivado(false), 1500)
        }
        iniciarParticulas()
        playSound("punto")
        setRestantes(prev => prev - 1)
        setSeleccionadas(prev => new Set([...prev, ...celdasSeleccionadas]))
        setElegidasRef(prev => {
          const nuevasElegidas = new Set(prev)
          nuevasElegidas.delete(palabraSel)
          return nuevasElegidas
        })

        setRestantesDeselec(prev => {
          const nuevosRestantesDeselec = [...prev]
          nuevosRestantesDeselec[elegidas.indexOf(palabraSel)] = true
          return nuevosRestantesDeselec
        })
      }
    }
    seleccionadasRef.current.clear()
    if (restantes == 1) {
      finalizar()
      playSound("victoria")
    }
  }, [tabla, elegidasRef, restantes, modalActivado])

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

  useEffect(() => {
    Orientation.lockToPortrait()
    
    const cargarTabla = async () => {
      await llenarTabla(tam, tam)
    }

    cargarTabla().catch((error) => {
      console.log("Error al cargar la tabla hmmta", error)
    })

    return () => {
      Orientation.unlockAllOrientations()
    }
  }, [])

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
    if (restantes === 0 || status == 9) {
      setEnMarcha(false)
      setMostrarConfetti(true)
    } else {
      if (status == 1){setEnMarcha(true)}
      setMostrarConfetti(false)
    }
  }, [restantes, status])

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        setModalSalirVisible(true)
        return true
      }
      BackHandler.addEventListener('hardwareBackPress', onBackPress)

      return () => { BackHandler.removeEventListener('hardwareBackPress', onBackPress) }
    }, [])
  )

  const generarLetras = () => {
    const letras = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'
    return letras[Math.floor(Math.random() * letras.length)]
  }

  const llenarTabla = async (filas: number, columnas: number) => {
    try {  
      const maxPalabras = Math.floor((filas + columnas) * 0.5)
      const minPalabras = Math.max(5, Math.floor(maxPalabras * 0.4))
      let numeroPal = Math.floor(Math.random() * (maxPalabras - minPalabras + 1)) + minPalabras
      const nuevaTabla = Array.from({ length: filas }, () => Array.from({ length: columnas }, () => ""))
  
      const palabrasEle: string[] = []
  
      while (numeroPal > 0) {
        palabras = [...palabras].sort(() => Math.random() - 0.5)

        let largoPalabra = palabras[0].length
        palabras[0] = palabras[0].toUpperCase()

        const direccion = Math.random() < 0.5

        for (let intento = 0; intento < 100; intento++) {
          const filaInicio = Math.floor(Math.random() * (filas - (direccion ? 0 : largoPalabra)))
          const columnaInicio = Math.floor(Math.random() * (columnas - (direccion ? largoPalabra : 0)))

          if (filaInicio < 0 || columnaInicio < 0) continue

          let cabe = true

          for (let i = 0; i < largoPalabra; i++) {
            const fila = filaInicio + (direccion ? 0 : i)
            const columna = columnaInicio + (direccion ? i : 0)

            if (fila >= filas || columna >= columnas || fila < 0 || columna < 0) {
              cabe = false
              break
            }

            if (
              nuevaTabla[fila][columna] !== "" &&
              nuevaTabla[fila][columna] !== palabras[0][i]
            ) {
              cabe = false
              break
            }
          }

          if (cabe) {
            for (let i = 0; i < largoPalabra; i++) {
              const fila = filaInicio + (direccion ? 0 : i)
              const columna = columnaInicio + (direccion ? i : 0)
              nuevaTabla[fila][columna] = palabras[0][i]
            }
            palabrasEle.push(palabras[0])
            numeroPal--
            break
          }
        }
        palabras = palabras.slice(1)
      }
  
      for (let fila = 0; fila < filas; fila++) {
        for (let columna = 0; columna < columnas; columna++) {
          if (nuevaTabla[fila][columna] === "") {
            nuevaTabla[fila][columna] = generarLetras()
          }
        }
      }
  
      setTabla(nuevaTabla)
      setElegidas(palabrasEle)
      setElegidasRef(new Set(palabrasEle))
    } catch (error) {
      console.log("Error al llenar la tabla:", error)
    }
  }  
  

  useEffect(() => {
    setRestantes(elegidas.length)
    setRestantesDeselec(Array(restantes).fill(false))
    setSeleccionadas(new Set())
    setSobreCelda(new Set())
    aInicio()
  }, [elegidas])

  const generarGestoPan = useCallback((filaI: number, columnaI: number) => {
    let ultimaFila = filaI
    let ultimaColumna = columnaI
  
    return Gesture.Pan()
      .onTouchesDown(() => {
        runOnJS(actualizarSobreCelda)(filaI, columnaI)
      })
      .onTouchesUp(() => {
        runOnJS(limpiarSobreCelda)()
      })
      .onTouchesCancelled(() => {
        runOnJS(limpiarSobreCelda)()
      })
      .onStart(() => {
        ultimaFila = filaI
        ultimaColumna = columnaI
        runOnJS(actualizarSeleccionTemporal)(filaI, columnaI)
      })
      .onUpdate((e) => {
        'worklet'
        const offsetX = e.translationX / tamCelda
        const offsetY = e.translationY / tamCelda
  
        const nuevaFila = Math.min(Math.max(Math.round(ultimaFila + offsetY), 0), tam - 1)
        const nuevaColumna = Math.min(Math.max(Math.round(ultimaColumna + offsetX), 0), tam - 1)
  
        if (nuevaFila !== ultimaFila || nuevaColumna !== ultimaColumna) {
          ultimaFila = nuevaFila
          ultimaColumna = nuevaColumna
          runOnJS(actualizarSeleccionTemporal)(nuevaFila, nuevaColumna)
        }
        runOnJS(actualizarSobreCelda)(nuevaFila, nuevaColumna)
      })
      .onEnd(() => {
        runOnJS(limpiarSobreCelda)()
        runOnJS(finalizarSeleccion)()
      })
  }, [actualizarSobreCelda, limpiarSobreCelda, actualizarSeleccionTemporal, finalizarSeleccion])

  const tablaMemo = useMemo(() => {
    return tabla.map((fila, filaI) => (
      <View key={filaI} style={estilos.fila}>
        {fila.map((celda, columnaI) => {
          const isSeleccionada = seleccionadas.has(`${filaI}-${columnaI}`)
          const isSobreCelda = sobreCelda.has(`${filaI}-${columnaI}`)

          return (
            <GestureDetector key={columnaI} gesture={generarGestoPan(filaI, columnaI)}>
              <View
                style={[
                  estilos.celda,
                  isSeleccionada && estilos.celdaSeleccionada,
                  isSobreCelda && estilos.celdaSobre
                ]}
              >
                <Text style={estilos.celdaTexto}>{celda}</Text>
              </View>
            </GestureDetector>
          )
        })}
      </View>
    ))
  }, [tabla, seleccionadas, sobreCelda])
  
  return (
    status == -2 ? (
      <Loader loading={status == -2} />
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
        coverScreen = {false}
        animationInTiming = {1000}
        animationOutTiming = {500}
        backdropOpacity= {0}
        isVisible={modalActivado}
        animationIn={'fadeInUp'}
        animationOut={'fadeOutDown'}
        style={estilos.modalContenedor}
      >

        <View style={estilos.modalContenido}>
          <Text style={estilos.encabezado}>{"¡Has encontrado una palabra!"}</Text>
        </View>
      </ReactNativeModal>
        
        <View style={estilos.contenedor}>
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
          <View style={estilos.cabecera}>
              <TouchableOpacity onPress={() => setModalSalirVisible(true)}>
                <View style={estilos.salirContenedor}>
                  <Text style={estilos.salirContenedorContenido}>X</Text>
                </View>
              </TouchableOpacity>
            <View style = {estilos.cabeceraContenedorDerecha}>
              <Text style={estilos.tiempoCabeceraStatus}>
                { timerRef.current >= 3600 ? Math.floor(timerRef.current / 3600) + "h " + Math.floor((timerRef.current % 3600) / 60) + "m " + timerRef.current % 60 + "s ⏰" : timerRef.current < 60 ? timerRef.current + " segundos ⏰" : Math.floor(timerRef.current / 60) + "m " + timerRef.current % 60 + "s ⏰" }
              </Text>
              <Text style={estilos.textoCabeceraStatus}>
                {
                  restantes === 1 ? "Resta 1 palabra" : "Restan " + restantes + " palabras"
                }
              </Text>
            </View>
          </View>

          <View style={estilos.cuerpo}>
            <View style={estilos.crucigramaContenedor}>
              <View style={estilos.tabla} onLayout={(event) => {
              const layout = event.nativeEvent.layout;
              setContenedorPos({ x: layout.x, y: layout.y })
            }}>
                {tablaMemo}
              </View>
            </View>

            <View style={estilos.palabrasContenedor}>
              <View style={estilos.palabrasFlat}>
                <Text style={estilos.textoPalabrasFlat}>¡Busca estas palabras!</Text>
                <FlatList
                  contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                  }}
                  data = {elegidas}
                  numColumns={2}
                  keyExtractor={(item,i) => item.toString()}
                  renderItem={({item,index})=>(
                    <View 
                      style={[
                          estilos.palabras,
                          restantesDeselec[index] && estilos.palabrasDeselec]}>
                      <Text style={estilos.palabrasTexto}>{item}</Text>
                    </View>
                  )}>
                </FlatList>
              </View>
            </View>
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
        <Text style={estilos.tituloObjetivoTexto}>Palabras descubiertas: {elegidas.length}</Text>
        <Text style={estilos.tituloObjetivoTexto}>Tu tiempo: {timerRef.current >= 3600 ? `${Math.floor(timerRef.current / 3600)}h ${Math.floor((timerRef.current % 3600) / 60)}m ${timerRef.current % 60}s` : timerRef.current <60 ? `${timerRef.current} segundos` : `${Math.floor(timerRef.current / 60)}m ${timerRef.current % 60}s` }</Text>
        <Text style={estilos.tituloFullTexto}>
          Tu promedio: ¡{Math.round((timerRef.current/elegidas.length) * Math.pow(10, 1)) / Math.pow(10, 1)} segundos por palabra!
        </Text>
        <TouchableOpacity style={estilos.botonEmpezarContainer} onPress={tareaTerminada}>
          <View style={estilos.botonEmpezar}>
            <Text style={estilos.botonEmpezarTexto}>Finalizar trivia</Text>
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
          <Text style={estilos.tituloFullTexto}>{"¡Equipaje de género!"}</Text>
          <Text style={estilos.tituloObjetivoTexto}>{"¡Busca y encuentra entre la sopa de letra los diferentes conceptos!"}</Text>
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

  modalContenedor: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    position: 'relative',
    backgroundColor: 'transparent'
  },
  modalContenido: {
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

  encabezado: {
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

  cargandoContenedorTexto: {
    textAlign: 'center',
    margin: '5%',
    color: pC.negro,
    fontSize: 25,
    fontWeight: 'bold'
  },

  tituloFullTexto: {
    textAlign: 'center',
    margin: '5%',
    color: pC.primario.DEFAULT,
    fontSize: 25,
    fontWeight: 'bold'
  },

  contenedor: {
    width: '90%',
    height: '95%',
    flexDirection: 'column',
    backgroundColor: pC.blanco
  },

  cabecera: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection:'row'
  },

  textoCabeceraStatus: {
    textAlign:"right",
    fontSize:20
  },
  tiempoCabeceraStatus: {
    textAlign:"right",
    fontSize:15
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

  crucigramaContenedor: {
    alignItems: 'center',
    width: '100%',
  },

  tabla: {
    flexDirection: 'column'
  },
  
  fila: {
    flexDirection: 'row'
  },
  celda: {
    width: tamCelda,
    height: tamCelda,
    borderWidth: bordeCelda,
    borderRadius:5,
    backgroundColor: pC.terciario.claro,
    borderColor: pC.primario.oscuro,
    justifyContent: 'center',
    alignItems: 'center',
  },
  celdaTexto: {
    fontSize: 18,
    fontWeight:'bold',
    color:pC.primario.DEFAULT
  },
  celdaSobre: {
    backgroundColor: pC.primario.claro,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 5,
  },
  celdaSeleccionada: {
    backgroundColor: pC.secundario.claro + pC.transparencia[10],
    borderColor: pC.terciario.DEFAULT,
    borderWidth: 2,
  },
  palabrasContenedor: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection:"row",
    borderRadius: 30,
    marginTop: 15,
    backgroundColor: pC.terciario.claro + pC.transparencia[50],
  },

  palabrasFlat:{
    justifyContent:'center',
    alignItems:'center',
  },

  textoPalabrasFlat: {
    marginTop:6,
    color:pC.primario.DEFAULT,
    fontSize:18,
    fontWeight:'bold'
  },

  palabras: {
    margin:3,
    borderColor: pC.primario.DEFAULT + pC.transparencia[90],
    borderWidth:1,
    borderRadius: 10,
    padding: 7,
    minWidth:120,
    maxWidth:120,
    alignItems: 'center'
  },
  palabrasDeselec: {
    backgroundColor: pC.blanco,
    borderColor: pC.terciario.DEFAULT,
    borderWidth: 2,
    padding: 6
    
  },
  palabrasTexto: {
    fontSize: 15,
    fontWeight: '500',
    color: pC.secundario.DEFAULT,
    textAlign: 'center'
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
})

export default Crucigrama
