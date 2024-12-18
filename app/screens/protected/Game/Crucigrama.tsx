import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Animated, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation, useRoute } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import ReactNativeModal from 'react-native-modal'
import { useToast } from 'react-native-toast-notifications'

import Loader from '@ui/components/Loader'

import { getTrivia } from '@services/GetTrivias.service'

import { RootStackParamList } from '@screens/RegisterScreen'

import pC from './src/theme/colores'

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>

interface Props {
  navigation: ProfileScreenNavigationProp
}
const Trivia = () => {
  const toast = useToast()
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

  const animacionMov = useState(new Animated.Value(-400))[0]
  const animacionOpacidad = useState(new Animated.Value(0))[0]

  const navigation = useNavigation()
  const route = useRoute()
  const { idTrivia }: any = route.params || {}
  console.log(idTrivia)

  const logoTrivia = require('./src/logoColectivo.png')

  const obtenerDatos = async () => {
    try {
      const resultado = await getTrivia('1')
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
    obtenerDatos()
  }, [])

  const siguiente = () => {
    setModalActivado(false)
    if (preguntaNumero < cantPreguntas - 1) {
      Animated.parallel([
        Animated.timing(animacionMov, { toValue: -500, duration: 400, useNativeDriver: true }),
        Animated.timing(animacionOpacidad, { toValue: 0, duration: 400, useNativeDriver: true })
      ]).start(() => {
        setDesabilitado([])
        setSeleccionado([])
        setCorrectas(0)
        setPreguntaNumero(preguntaNumero + 1)
        getCantRespuestas()
        animacionMov.setValue(500)
        animacionOpacidad.setValue(0)
        Animated.parallel([
          Animated.timing(animacionMov, { toValue: 0, duration: 400, useNativeDriver: true }),
          Animated.timing(animacionOpacidad, { toValue: 1, duration: 400, useNativeDriver: true })
        ]).start()
      })
    } else {
      setPreguntaNumero(preguntaNumero + 1)
    }
  }

  const clicRespuesta = (index: number) => {
    if (seleccionado.length === 0) {
      const arreglo = Array(trivia.questions[preguntaNumero]?.answers?.length || 0).fill(false)
      setSeleccionado(arreglo)
      setDesabilitado(arreglo)
    }

    return new Promise<any[]>(resolve => {
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
    }).then(nuevosEstados => {
      setBotonValidar(nuevosEstados.some(valor => valor === true))
    })
  }

  const getCantRespuestas = (numero = preguntaNumero) => {
    setCantRespuestas(
      trivia.questions?.[numero]?.answers?.filter((respuesta: any) => respuesta.answer_option === 1).length || 0
    )
    return trivia.questions?.[numero]?.answers?.filter((respuesta: any) => respuesta.answer_option === 1).length || 0
  }
  const validarRespuesta = () => {
    setBotonValidar(false)
    let correcta = true
    const respuestas = trivia.questions?.[preguntaNumero]?.answers || []
    const incorrectas = Array(respuestas.length).fill(false)

    respuestas.forEach((respuesta: any, i: number) => {
      if (seleccionado[i] && respuesta.answer_option !== 1) {
        incorrectas[i] = true
        correcta = false
      } else if (seleccionado[i] && respuesta.answer_option === 1) {
        setTextoCorrecta(respuesta.answer_description)
      }
    })

    if (correcta) {
      setCorrectas(correctas + 1)
      setModalActivado(true)
    } else {
      setModalActivado(false)
      toast.show('Respuesta incorrecta', {
        type: 'error',
        placement: 'top',
        duration: 4000,
        animationType: 'slide-in'
      })
    }
  }

  const salir = () => {
    // navigation.navigate('Inicio')
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
      <ReactNativeModal
        backdropOpacity={0.5}
        isVisible={modalActivado}
        animationIn={'fadeIn'}
        animationOut={'fadeOut'}
        style={estilos.modalContenedor}
      >
        <View style={estilos.modalContenido}>
          <Image source={logoTrivia} style={estilos.logoModal} resizeMode='cover'></Image>
          <Text style={estilos.encabezado}>{textoCorrecta}</Text>
          <TouchableOpacity style={estilos.botonModal} onPress={modalCorrecta}>
            <Text style={estilos.botonModalTexto}>
              {correctas === cantRespuestas && preguntaNumero != cantPreguntas - 1
                ? 'Siguiente pregunta'
                : preguntaNumero == cantPreguntas - 1
                ? 'Finalizar'
                : 'Aceptar'}
            </Text>
          </TouchableOpacity>
        </View>
      </ReactNativeModal>

      {preguntaNumero >= 0 && preguntaNumero < cantPreguntas ? (
        <View style={estilos.contenedor}>
          {/* <View style={estilos.cabecera}>
            <TouchableOpacity onPress={salir}>
              <View style={estilos.salirContenedor}>
                <Text style={estilos.salirContenedorContenido}>X</Text>
              </View>
            </TouchableOpacity>
          </View> */}

          <Animated.View
            style={[estilos.cuerpo, { transform: [{ translateX: animacionMov }], opacity: animacionOpacidad }]}
          >
            <View style={estilos.preguntaContenedor}>
              <View style={estilos.progresoContenedor}>
                <View style={estilos.progresoTextoContenedor}>
                  <Text style={estilos.progresoTexto}>
                    {preguntaNumero + 1} / {cantPreguntas}
                  </Text>
                </View>
                <View style={estilos.barraProgresoContenedor}>
                  <View style={estilos.barraProgresoFondo}>
                    <View
                      style={[estilos.barraProgreso, { width: `${((preguntaNumero + 1) / cantPreguntas) * 100}%` }]}
                    ></View>
                  </View>
                </View>
              </View>
              <View style={estilos.preguntaContenedorTexto}>
                <Text style={estilos.pCTT}>{preguntas[preguntaNumero].question_name}</Text>
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
                      activeOpacity={0.8}
                      disabled={desabilitado[index]}
                      style={[
                        estilos.respuesta,
                        desabilitado[index] && { backgroundColor: pC.primario.claro + pC.transparencia[50] },
                        seleccionado[index] && { backgroundColor: pC.primario.oscuro }
                      ]}
                      onPress={() => {
                        clicRespuesta(index)
                      }}
                    >
                      <Text style={estilos.respuestaTexto}>{item.answer_name}</Text>
                    </TouchableOpacity>
                  )}
                ></FlatList>
              </View>
            </View>
            <View style={estilos.pieContenedor}>
              <TouchableOpacity
                activeOpacity={0.8}
                disabled={!botonValidar}
                onPress={validarRespuesta}
                style={[
                  estilos.botonPie,
                  botonValidar && { backgroundColor: pC.secundario.DEFAULT + pC.transparencia[70] }
                ]}
              >
                <Text style={estilos.botonPieTexto}>Validar</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      ) : preguntaNumero < 0 ? (
        <View style={estilos.contenedorFull}>
          <Image source={logoTrivia} style={estilos.logoTrivia} resizeMode='cover'></Image>
          <Text style={estilos.tituloFullTexto}>{trivia.trivia_name}</Text>
          <Text style={estilos.tituloObjetivoTexto}>{trivia.trivia_objective}</Text>
          <TouchableOpacity style={estilos.botonEmpezarContainer} onPress={empezartrivia}>
            <View style={estilos.botonEmpezar}>
              <Text style={estilos.botonEmpezarTexto}>Empezar trivia</Text>
            </View>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={estilos.contenedorFull}>
          <Image source={logoTrivia} style={estilos.logoTrivia} resizeMode='cover'></Image>
          <Text style={estilos.tituloFullTexto}>¡Felicidades!</Text>
          <Text style={estilos.tituloObjetivoTexto}>¡Has terminado la trivia!</Text>
          <TouchableOpacity style={estilos.botonEmpezarContainer} onPress={salir}>
            <View style={estilos.botonEmpezar}>
              <Text style={estilos.botonEmpezarTexto}>Finalizar trivia</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

const estilos = StyleSheet.create({
  contenedorGeneral: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: pC.blanco
  },

  logoModal: {
    width: 200,
    height: 200,
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
    borderRadius: 10
  },

  botonModalTexto: {
    color: pC.blanco,
    textAlign: 'center',
    fontWeight: 'bold'
  },

  contenedorFull: {
    borderRadius: 20,
    paddingHorizontal: 20,
    width: '100%',
    // margin: '5%',
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

  logoTrivia: {
    width: 200, // Quita las comillas
    height: 200, // Quita las comillas
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

  salirContenedor: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: '5%',
    paddingVertical: '2%',
    marginVertical: 10,
    width: '20%',
    borderRadius: 10,
    backgroundColor: pC.primario.DEFAULT + pC.transparencia[30]
  },

  salirContenedorContenido: {
    fontSize: 30,
    fontWeight: 'bold',
    color: pC.primario.DEFAULT
  },

  cuerpo: {
    flex: 1,
    marginTop: 10,
    justifyContent: 'flex-start'
  },

  preguntaContenedor: {
    alignItems: 'center',
    width: '100%',
    height: '25%',
    backgroundColor: pC.primario.DEFAULT + pC.transparencia[50],
    borderRadius: 30,
    padding: 20
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
    backgroundColor: pC.terciario.claro + pC.transparencia[90]
  },

  preguntaContenedorTexto: {
    justifyContent: 'center',
    width: '100%',
    height: '70%'
  },

  pCTT: {
    fontSize: 20,
    textAlign: 'center',
    color: pC.blanco,
    fontWeight: 'bold'
  },

  pCTTCh: {
    fontSize: 13,
    margin: 3,
    textAlign: 'center',
    color: pC.primario.claro,
    fontWeight: '500'
  },

  respuestasContenedor: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    // backgroundColor: 'black',
    paddingTop: 20,
    height: 'auto' // Cambia el tamaño basado en el contenido
    // o utiliza un valor específico como:
    // maxHeight: '70%',
  },
  respuestasLista: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },

  respuesta: {
    margin: 5,
    backgroundColor: pC.primario.DEFAULT + pC.transparencia[90],
    borderRadius: 10,
    padding: 15,
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center'
  },

  respuestaTexto: {
    fontSize: 15,
    fontWeight: '500',
    color: pC.blanco,
    textAlign: 'center'
  },
  pieContenedor: {
    justifyContent: 'center',
    alignItems: 'center',
    // padding: 10,
    width: '100%',
    height: '45%'
  },
  botonPie: {
    width: 180,
    padding: 20,
    borderRadius: 10,

    // borderStartStartRadius: 30,
    // borderEndStartRadius: 30,
    backgroundColor: pC.secundario.DEFAULT + pC.transparencia[30],
    justifyContent: 'center',
    alignItems: 'center'
  },
  botonPieTexto: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'bold',
    color: pC.blanco
  }
})

export default Trivia
