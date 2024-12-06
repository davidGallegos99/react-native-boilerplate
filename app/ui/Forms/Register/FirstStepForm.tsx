/* eslint-disable react-native/no-inline-styles */
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import Logo from '../../../../logo.svg'
import TextField from '../TextField'
import { Formik } from 'formik'
import * as Yup from 'yup'

import Button from '@ui/components/Button'
import Title from '@ui/tipografy/Title'

import colors from '@config/theme/colors'

const SignupSchema = Yup.object().shape({
  name: Yup.string().min(4, 'Muy corto!').required('El nombre es requerido'),
  email: Yup.string().email('Email Invalido').required('Email es requerido'),
  password: Yup.string().min(8, 'Muy corto!').required('Contraseña es requerida')
})

interface Props {
  onSubmit: Function
  navigation: any
}

export function FirstStepForm({ onSubmit, navigation }: Props) {
  const handleLogin = () => {
    navigation.navigate('Login')
  }
  return (
    <View style={styles.mainContainer}>
      <View style={styles.appLogoContainer}>
        <Logo width={200} height={200} />
      </View>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={SignupSchema}
        onSubmit={values => {
          onSubmit({ ...values, password_confirmation: values.password })
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }: any) => (
          <View style={styles.formContainer}>
            <Title style={{ textAlign: 'center' }}>Crea tu cuenta</Title>
            <View style={styles.controlsContainer}>
              <View style={styles.spacing}>
                <TextField
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  value={values.name}
                  placeholder='Nombre'
                />
                {errors.name && touched.name && <Text style={styles.errorText}>{errors.name}</Text>}
              </View>
              <View style={styles.spacing}>
                <TextField
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  placeholder='Correo'
                />
                {errors.email && touched.email && <Text style={styles.errorText}>{errors.email}</Text>}
              </View>
              <View style={styles.spacing}>
                <TextField
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  placeholder='Contraseña'
                  secureTextEntry
                />
                {errors.password && touched.password && <Text style={styles.errorText}>{errors.password}</Text>}
              </View>
              <Text style={styles.termsAndConditionTitle}>Aplicación para mayores de 18+ </Text>
              <Text style={styles.termsAndCondition}>
                Al presionar confirmar usted acepta nuestros terminos y condiciones{' '}
              </Text>
              <View style={styles.buttonBox}>
                <Button appearance='filled' color={colors.primary} handleClick={handleSubmit} rounded>
                  CONFIRMAR
                </Button>
              </View>
              <Text style={styles.loginText}>
                ¿Ya tienes una cuenta?{' '}
                <Text style={styles.loginLink} onPress={handleLogin}>
                  INICIAR SESIÓN
                </Text>
              </Text>
            </View>
          </View>
        )}
      </Formik>
    </View>
  )
}
const styles = StyleSheet.create({
  termsAndCondition: {
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 10,
    color: colors.secondaryTextColor,
    marginBottom: 20
  },
  termsAndConditionTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 15,
    color: colors.secondaryTextColor,
    marginBottom: 10
  },
  loginLink: {
    fontWeight: 'bold',
    color: colors.primaryTextColor
  },
  mainContainer: {
    flex: 1
  },
  loginText: {
    fontSize: 14,
    color: colors.primaryTextColor,
    textAlign: 'center',
    marginTop: 25
  },
  buttonBox: {
    width: '100%'
  },
  appLogoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  formContainer: {
    flex: 2
  },
  controlsContainer: {
    marginTop: 20,
    width: '90%',
    margin: 'auto'
  },
  spacing: {
    marginBottom: 20
  },
  errorText: {
    color: 'red'
  }
})
