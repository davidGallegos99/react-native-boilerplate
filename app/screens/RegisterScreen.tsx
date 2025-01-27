import React, { useState } from 'react'
import { Button, SafeAreaView, StyleSheet } from 'react-native'

import OKicon from '../assets/icons/ok.svg'
import useAuthStore from '../store/useAuthStore'
import { StackNavigationProp } from '@react-navigation/stack'
import { User } from 'interfaces/Auth.inteface'
import { useToast } from 'react-native-toast-notifications'

import { FirstStepForm } from '@ui/Forms/Register/FirstStepForm'
import { SecondStepForm } from '@ui/Forms/Register/SecondStep'
import { ThirdStepForm } from '@ui/Forms/Register/ThirdStepForm'

import { storeData } from '@services/AsyncStorage.service'
import { createUserInfo } from '@services/auth/createUserInfo'
import { createUserInterest } from '@services/auth/createUserInterests'
import { createUser, verifyEmail } from '@services/auth/registerUser'

export type RootStackParamList = {
  Register: undefined
  Login: undefined
  SignUpOpts: undefined
  Welcome: undefined
  MainGame: undefined
  Main: undefined
  Description1: undefined
  Description2: undefined
  Calendar: undefined
  Juegos: { idTrivia: number }
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

function RegisterScreen({ navigation }: Props) {
  const { setUser, setIsLoggedIn, User } = useAuthStore()
  const [registerData, setregisterData] = useState<Record<string, any>>({})
  const [step, setstep] = useState<number>(1)
  const toast = useToast()

  const registerUser = async (data: Record<string, any>) => {
    try {
      const res1 = await createUser({
        email: data.email,
        name: data.name,
        password: data.password,
        password_confirmation: data.password
      })
      await storeData('jwt', res1?.access_token)

      const res2 = await createUserInfo({
        alias: data.alias,
        birth_date: data.birth_date,
        department_id: data.department_id,
        gender_id: data.gender_id
      })

      const res3 = await createUserInterest({
        interest_ids: data.interest_ids
      })

      toast.show('Usuario creado con éxito.', {
        type: 'success',
        placement: 'top',
        icon: <OKicon />,
        duration: 4000,
        animationType: 'slide-in'
      })
    } catch (error: any) {
      console.error('Ocurrió un error al crear al usuario', error)
    }
  }

  const handleFirstStep = async (data: User) => {
    const response = await verifyEmail({ email: data?.email })
    if (response.message === 'El valor del campo email ya está en uso.') {
      toast.show('Este correo ya está en uso.', {
        type: 'danger',
        placement: 'top',
        duration: 4000,
        animationType: 'slide-in'
      })
    } else {
      setregisterData(prevState => ({
        ...prevState,
        ...data
      }))
      setUser(data)
      setstep(2)
    }
  }

  const handleSecondStep = (data: User) => {
    setregisterData(prevState => ({
      ...prevState,
      ...data
    }))
    setUser(data)
    setstep(3)
  }

  const handleThirdStep = async (data: User) => {
    const updatedData = {
      ...registerData,
      ...data
    }

    await registerUser(updatedData)

    navigation.navigate('Welcome')
  }
  return (
    <SafeAreaView style={styles.container}>
      {step === 1 && <FirstStepForm onSubmit={handleFirstStep} navigation={navigation} />}
      {step === 2 && <SecondStepForm onSubmit={handleSecondStep} />}
      {step === 3 && <ThirdStepForm onSubmit={handleThirdStep} />}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  text: {
    fontSize: 25,
    fontWeight: '500'
  }
})

export default RegisterScreen
