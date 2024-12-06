import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import Logo from '../../logo.svg'
import useAuthStore from '../store/useAuthStore'
import { StackNavigationProp } from '@react-navigation/stack'

import colors from '@config/theme/colors'

import { LayoutUtils } from '@utils/layout'

import { RootStackParamList } from './SignUpOptsScreen'

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Welcome'>
interface Props {
  navigation: RegisterScreenNavigationProp
}
const WelcomeScreen = ({ navigation }: Props) => {
  const { User } = useAuthStore()

  setTimeout(() => {
    navigation.navigate('Main')
  }, 3000)

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Logo width={200} height={200} />
      </View>
      <Text style={styles.welcomeText}>¡Bienvenida/o/e {User?.name}!</Text>

      <Text style={styles.loadingText}>Estamos cargando tu información para encontrar el lugar ideal para tí...</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: LayoutUtils.moderateScale(20)
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30
  },
  logoPlaceholder: {
    width: 200,
    height: LayoutUtils.moderateVerticalScale(200),
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20
  },
  logoText: {
    color: '#000',
    fontSize: 18
  },
  welcomeText: {
    fontSize: LayoutUtils.moderateScale(24),
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.secondaryTextColor,
    marginBottom: LayoutUtils.moderateScale(10)
  },
  loadingText: {
    fontSize: LayoutUtils.scaleFontSize(16),
    color: colors.primaryTextColor,
    textAlign: 'center'
  }
})

export default WelcomeScreen
