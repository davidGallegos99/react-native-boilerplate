import React, { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, Easing } from 'react-native-reanimated'

type ParticleProps = {
  origin: { x: number; y: number }
  minSize?: number
  maxSize?: number
  duration?: number
  color?: string
  spread?: number
}

const Particle: React.FC<ParticleProps> = ({ origin, minSize = 4, maxSize = 10, duration = 800, color = 'white', spread = 50 }) => {
  const size = Math.random() * (maxSize - minSize) + minSize
  const translateX = useSharedValue(origin.x)
  const translateY = useSharedValue(origin.y)
  const opacity = useSharedValue(1)

  useEffect(() => {
    const angle = Math.random() * 2 * Math.PI
    const distance = Math.random() * spread
    const speedMultiplier = Math.random() * 0.6 + 0.7 // Aleatorizar duración (0.7x a 1.3x)

    const targetX = origin.x + Math.cos(angle) * distance
    const targetY = origin.y + Math.sin(angle) * distance

    translateX.value = withTiming(targetX, { duration: duration * speedMultiplier, easing: Easing.out(Easing.ease) })
    translateY.value = withTiming(targetY, { duration: duration * speedMultiplier, easing: Easing.out(Easing.ease) })
    opacity.value = withDelay(duration * 0.5, withTiming(0, { duration: duration * 0.5 }))
  }, [])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
    opacity: opacity.value,
    width: size,
    height: size,
    borderRadius: size / 2
  }))

  return (
    <Animated.View
      style={[styles.particle, animatedStyle, { backgroundColor: color }]}
    />
  )
}

type ParticlesProps = {
  origin: { x: number; y: number }
  count?: number
  minSize?: number
  maxSize?: number
  duration?: number
  color?: string
  spread?: number
  style?: any
}

const Particles: React.FC<ParticlesProps> = ({
  origin,
  count = 15,
  minSize = 4,
  maxSize = 10,
  duration = 800,
  color = 'white',
  spread = 50,
  style
}) => {
  return (
    <View style={[StyleSheet.absoluteFill, style]} pointerEvents="none">
      {Array.from({ length: count }).map((_, i) => (
        <Particle
          key={i}
          origin={origin}
          minSize={minSize}
          maxSize={maxSize}
          duration={duration}
          color={color}
          spread={spread}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  particle: {
    position: 'absolute'
  }
})

export default Particles
