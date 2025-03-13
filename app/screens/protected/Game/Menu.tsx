import React, { useEffect, useState } from 'react'
import { Image, ImageSourcePropType, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'

import Pacman from './src/components/el_pacman'
import pC from './src/theme/colores'

const fondoHeader = require('./src/theme/headerBackground.jpg')

type RootStackParamList = {
  [key: string]: { [key: string]: any }
}

type Juego = {
  id: string
  name: string
  modulo: string
  view: string
  descripcion: string
  imagen: ImageSourcePropType
}

const HomeScreen = () => {
  //const [juegos, setJuegos] = useState<Juego[]>([])
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()
  const modulo = 9

  const juegos: Juego[] = [
    {
      id: '1',
      name: 'Equipaje de género',
      modulo: '1',
      view: 'SopaLetras',
      descripcion: 'Un juego de crucigrama educativo',
      imagen: require('./src/icons/crucigrama.jpg')
    },
    {
      id: '2',
      name: 'EmotiMatch',
      modulo: '1',
      view: 'Parejas',
      descripcion: 'un juego divertido de parejas',
      imagen: require('./src/icons/parejas.jpg')
    }
  ]

  return (
    <View style={estilos.contenedorGeneral}>
      {juegos.length != 0 ? (
        <View style={estilos.contenedorCabezo}>
          <Image source={fondoHeader} style={estilos.imagenFondoCabezo}></Image>
          <View style={estilos.contenedorCabezoFiltro}></View>
          <Pacman></Pacman>
        </View>
      ) : (
        ''
      )}

      <View style={estilos.contenedorMenu}>
        {juegos.length === 0 ? (
          <View style={estilos.noJuegos}>
            <Text style={estilos.noJuegosTexto}>
              ¡Ups!, Parece que no hay juegos disponibles en este momento, intenta más tarde
            </Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={estilos.scrollVista} showsVerticalScrollIndicator={false}>
            {juegos.map(item => {
              if (parseInt(item.modulo) <= modulo) {
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={estilos.tarjeta}
                    onPress={() => navigation.navigate('Game', { screen: item.view })}
                  >
                    <Image source={item.imagen} resizeMode='cover' style={estilos.tarjetaImagen} />
                    <Text style={estilos.tarjetaTitulo}>{item.name}</Text>
                  </TouchableOpacity>
                )
              }
            })}
          </ScrollView>
        )}
      </View>
      {/* <View style={estilos.contenedorPie}>
        <View><Text>Pie de página</Text></View>
      </View> */}
    </View>
  )
}

const estilos = StyleSheet.create({
  contenedorGeneral: {
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: pC.blanco
  },
  contenedorCabezo: {
    width: '100%',
    height: '12%',
    alignItems: 'center',
    marginBottom: 20
  },
  contenedorCabezoFiltro: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    backgroundColor: pC.primario.DEFAULT + pC.transparencia[60]
  },
  imagenFondoCabezo: {
    position: 'absolute',
    resizeMode: 'cover',
    height: '100%',
    width: '100%',
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20
  },
  contenedorMenu: {
    flex: 1,
    marginHorizontal: 20,
    width: '80%'
  },
  contenedorPie: {
    height: '12%',
    width: '100%',
    backgroundColor: 'green'
  },
  noJuegos: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  noJuegosTexto: {
    textAlign: 'center',
    margin: 16,
    color: pC.negro
  },
  tarjeta: {
    alignItems: 'center',
    margin: 12,
    width: 110
  },
  tarjetaImagen: {
    width: 110,
    height: 110,
    borderRadius: 16
  },
  tarjetaTitulo: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: pC.primario.DEFAULT
  },
  scrollVista: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    paddingVertical: 20
  }
})

export default HomeScreen
