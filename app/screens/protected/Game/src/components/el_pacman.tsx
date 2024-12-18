import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Animated, Dimensions, Easing } from 'react-native'
import Svg, { Path } from 'react-native-svg'

const { width } = Dimensions.get('window')

interface Cuadro {
  id: number;
  left: number;
  visible: boolean;
}

const Pacman: React.FC = () => {
  const tiempo = 20000
  const puntosN = 10
  const desplazamiento = useState(new Animated.Value(0))[0]
  const [bocaAbierta, setbocaAbierta] = useState(true)
  const [cuadrados, setCuadrados] = useState<Cuadro[]>(
    Array.from({ length: puntosN }, (_, index) => ({
      id: index,
      left: (width / puntosN) * index,
      visible: true,
    }))
  )

  useEffect(() => {
    Animated.loop(
      Animated.timing(desplazamiento, {
        toValue: 1,
        duration: tiempo,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    ).start()

    const cambiaBoca = () => {
      setbocaAbierta((prev) => !prev)
    }

    const bocaIntervalo = setInterval(cambiaBoca, 300)
    return () => clearInterval(bocaIntervalo)
  }, [])

  const translateX = desplazamiento.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, width + 100],
  })

  const svgBocas = bocaAbierta
    ? 'M50,50 L50,5 A45,45 0 1,1 50,95 A45,45 0 1,1 50,5 Z'
    : 'M50,5 A45,45 0 1,0 90,50 L50,50 Z'

  const manejarColision = (pacmanPosition: number) => {
    setCuadrados((prevCuadrados) =>
      prevCuadrados.map((cuadro) => {
        if (cuadro.visible && pacmanPosition >= cuadro.left && pacmanPosition < cuadro.left + 10) {
          setTimeout(() => {
            setCuadrados((prev) =>
              prev.map((c) =>
                c.id === cuadro.id ? { ...c, visible: true } : c
              )
            )
          }, tiempo/2)
          return { ...cuadro, visible: false }
        }
        return cuadro
      })
    )
  }

  useEffect(() => {
    const handleCollision = () => {
      translateX.addListener(({ value }) => manejarColision(value-10))
    }

    handleCollision()

    return () => translateX.removeAllListeners()
  }, [translateX])

  return (
    <View style={estilos.pacTenedor}>
      <View style={estilos.contenedorCuadro}>
        {cuadrados.map(
          (cuadro) =>
            cuadro.visible && (
              <View
                key={cuadro.id}
                style={[estilos.cuadro, { left: cuadro.left }]}
              />
            )
        )}
      </View>
      <Animated.View style={[estilos.pacman, { transform: [{ translateX }] }]}>
        <Svg height="50" width="50" viewBox="0 0 100 100" transform="rotate(45, 50, 50)">
          <Path d={svgBocas} fill="yellow" />
        </Svg>
      </Animated.View>
    </View>
  )
}

const estilos = StyleSheet.create({
  pacTenedor: {
    flex: 1,
    width: "100%",
    justifyContent: 'center',
    alignItems: "flex-start",
  },
  pacman: {
    position: 'absolute',
  },
  contenedorCuadro:{
    width:"100%",
    flex:1,
    justifyContent:"center",
    alignContent:"center",
    marginLeft:"4%",
  },
  cuadro: {
    position: 'absolute',
    width: 10,
    height: 10,
    backgroundColor: 'yellow',
    borderRadius: 2,
  },
});

export default Pacman;
