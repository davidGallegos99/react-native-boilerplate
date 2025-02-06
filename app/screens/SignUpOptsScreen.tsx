import React from 'react'
import { Alert, StyleSheet, Text, View } from 'react-native'

import Logo from '../../logo.svg'
import Google from '../assets/icons/google.svg'
import { StackNavigationProp } from '@react-navigation/stack'

import Button from '@ui/components/Button'

import colors from '@config/theme/colors'

import { LayoutUtils } from '@utils/layout'

export type RootStackParamList = {
  Register: undefined
  Login: undefined
  Welcome: undefined
  Main: undefined
  SignUpOpts: undefined

  Game: { screen: string; params?: { idTrivia?: number } }
  MainGame: undefined
  Description1: undefined
  Description2: undefined
  Description3: undefined
  Calendar: undefined
  Juegos: { idTrivia: number } // Nueva ruta con parámetros
  TriviaModulesScreen: undefined
  TriviaScreen: undefined
  TriviaDetails: {
    moduleName: string
    trivias: { id: number; trivia_name: string }[]
  }
}

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>
interface Props {
  navigation: RegisterScreenNavigationProp
}

function SignUpOptsScreen({ navigation }: Props) {
  const handleRegister = () => {
    navigation.navigate('Register')
  }

  const handleRegisterWithGoogle = () => {
    // Alert.alert('Registro con Google', 'Has presionado REcGISTRAR CON GOOGLE')
  }

  const handleLogin = () => {
    navigation.navigate('Login')
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Logo width={200} height={200} />
      </View>

      <View style={styles.bottonsContainer}>
        <View style={styles.button}>
          <Button appearance='filled' color={colors.primary} handleClick={handleRegister} rounded>
            REGISTRATE
          </Button>
        </View>

        <View style={styles.button}>
          <Button
            icon={<Google style={{ borderColor: colors.secondary }} width={24} height={24} />}
            color={colors.secondary}
            handleClick={handleRegisterWithGoogle}
            appearance='outlined'
            rounded
          >
            REGISTRAR CON GOOGLE
          </Button>
        </View>
      </View>

      <Text style={styles.loginText}>
        ¿Ya tienes una cuenta?{' '}
        <Text style={styles.loginLink} onPress={handleLogin}>
          INICIAR SESIÓN
        </Text>
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: LayoutUtils.moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  bottonsContainer: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: LayoutUtils.moderateScale(30),
    paddingBottom: LayoutUtils.moderateScale(30),
    height: LayoutUtils.moderateVerticalScale(250),
    justifyContent: 'space-between'
  },
  button: {
    width: '90%'
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 10,
    backgroundColor: '#e0e0e0'
  },

  loginText: {
    fontSize: 14,
    color: '#888'
  },
  loginLink: {
    fontWeight: 'bold',
    color: '#533A8E'
  }
})

export default SignUpOptsScreen
