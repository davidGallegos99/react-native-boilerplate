import React, { useState } from 'react'
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native'

import Logo from '../../logo.svg'
import Google from '../assets/icons/google.svg'
import OKicon from '../assets/icons/ok.svg'
import { StackNavigationProp } from '@react-navigation/stack'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useToast } from 'react-native-toast-notifications'

import LoginForm from '@ui/Forms/LoginForm'
import Button from '@ui/components/Button'
import PasswordResetModal from '@ui/components/ForgotPswModal'
import Title from '@ui/tipografy/Title'

import { storeData } from '@services/AsyncStorage.service'
import { ForgotPassword, ForgotPasswordCode, ForgotPasswordReset } from '@services/auth/ForgotPassowrd.service'
import { Login } from '@services/auth/loginService'

import colors from '@config/theme/colors'

import { LayoutUtils } from '@utils/layout'

import { RootStackParamList } from './RegisterScreen'

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>
interface Props {
  navigation: RegisterScreenNavigationProp
}

function LoginScreen({ navigation }: Props) {
  const toast = useToast()
  const [email, setEmail] = useState<string>('')
  const [codeLocal, setCodeLocal] = useState<string>('')
  const [isModalVisible, setModalVisible] = useState<boolean>(false)

  const handleLoginWithGoogle = () => {
    Alert.alert('Registro con Google', 'Has presionado REGISTRAR CON GOOGLE')
  }

  const handleLoginWithEmailAndPassword = async (data: { email: string; password: string }) => {
    try {
      const response = await Login(data)
      await storeData('jwt', response?.access_token)
      await storeData('user', JSON.stringify(response))
      toast.show('Bienvenid@.', {
        type: 'success',
        placement: 'top',
        icon: <OKicon />,
        duration: 4000,
        animationType: 'slide-in'
      })
      navigation.navigate('Description1')
    } catch (error) {
      toast.show('Usuario o contraseña incorrectos.', {
        type: 'error',
        placement: 'top',
        duration: 4000,
        animationType: 'slide-in'
      })
    }
  }

  const handleResetPassword = () => {
    setModalVisible(true)
  }

  const handleEmailSubmission = async (submittedEmail: string) => {
    const res = await ForgotPassword(submittedEmail)
    setEmail(submittedEmail)
  }

  const handleCodeSubmission = async (code: string): Promise<boolean> => {
    try {
      const res = await ForgotPasswordCode(email, code)
      setCodeLocal(code)
      if (res.message === 'Código válido') {
        return true
      }
      return false
    } catch (error: any) {
      setModalVisible(false)
      toast.show('Código inválido.', {
        type: 'danger',
        placement: 'top',
        duration: 4000,
        animationType: 'slide-in'
      })
      return false
    }
  }

  const handlePasswordChange = async (newPassword: string) => {
    try {
      setModalVisible(false)
      await ForgotPasswordReset({
        code: codeLocal,
        email,
        password: newPassword,
        password_confirmation: newPassword
      })
      toast.show('Contraseña actualizada exitosamente.', {
        type: 'success',
        placement: 'top',
        duration: 4000,
        animationType: 'slide-in'
      })
    } catch (error) {
      toast.show('Contraseña no actualizada.', {
        type: 'danger',
        placement: 'top',
        duration: 4000,
        animationType: 'slide-in'
      })
    }
  }

  const getEmailForResetPass = (val: string) => {
    setEmail(val)
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.welcomeLabelContainer}>
          <View style={styles.logoContainer}>
            <Logo width={130} height={120} />
          </View>
          <Title>¡Bienvenido/a!</Title>
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.button}>
            <Button
              icon={<Google width={24} height={24} />}
              color={colors.secondary}
              handleClick={handleLoginWithGoogle}
              appearance='outlined'
              rounded
            >
              REGISTRAR CON GOOGLE
            </Button>
          </View>
          <Text style={styles.enterPersonalInfoText}>Ó INGRESA CON TUS DATOS</Text>
          <LoginForm handleEmail={getEmailForResetPass} onSubmit={handleLoginWithEmailAndPassword} />
          <View style={styles.forgotPasswordBox}>
            <TouchableOpacity onPress={handleResetPassword}>
              <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
          </View>
        </View>
        <PasswordResetModal
          isVisible={isModalVisible}
          onClose={() => setModalVisible(false)}
          onSubmitEmail={handleEmailSubmission}
          onSubmitCode={handleCodeSubmission}
          onSubmitNewPassword={handlePasswordChange}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center'
  },
  forgotPasswordText: {
    color: colors.primaryTextColor,
    fontSize: LayoutUtils.scaleFontSize(18),
    textAlign: 'center'
  },
  forgotPasswordBox: {
    marginTop: LayoutUtils.moderateScale(20),
    paddingBottom: LayoutUtils.moderateScale(30)
  },
  enterPersonalInfoText: {
    marginTop: LayoutUtils.moderateScale(20),
    marginBottom: LayoutUtils.moderateScale(40),
    color: colors.primaryTextColor,
    fontWeight: '600'
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: LayoutUtils.moderateScale(30)
  },
  welcomeLabelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: LayoutUtils.moderateScale(20)
  },
  contentContainer: {
    alignItems: 'center'
  },
  button: {
    width: '90%'
  }
})

export default LoginScreen
