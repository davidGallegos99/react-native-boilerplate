/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import Logo from '../../../../logo.svg'
import TextField from '../TextField'
import { Formik } from 'formik'
import { Checkbox } from 'react-native-paper'
import * as Yup from 'yup'

import Button from '@ui/components/Button'
import Title from '@ui/tipografy/Title'

import colors from '@config/theme/colors'

const SignupSchema = Yup.object().shape({
  name: Yup.string().min(4, 'Muy corto!').required('El nombre es requerido'),
  email: Yup.string().email('Email inválido').required('Email es requerido'),
  password: Yup.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres.')
    .matches(/[A-Z]/, 'La contraseña debe incluir al menos una letra mayúscula.')
    .matches(/[a-z]/, 'La contraseña debe incluir al menos una letra minúscula.')
    .matches(/[0-9]/, 'La contraseña debe incluir al menos un número.')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'La contraseña debe incluir al menos un carácter especial.')
    .required('La contraseña es requerida')
})

interface Props {
  onSubmit: Function
  navigation: any
}

export function FirstStepForm({ onSubmit, navigation }: Props) {
  const [checkboxSelected, setCheckboxSelected] = useState<boolean>(false)
  const handleLogin = () => {
    navigation.navigate('Login')
  }
  return (
    <View style={styles.mainContainer}>
      <View style={styles.appLogoContainer}>
        <Logo width={200} height={200} />
      </View>
      <Formik
        initialValues={{ name: '', email: '', password: '' }}
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
              <View style={styles.checkboxContainer}>
                <Checkbox
                  status={checkboxSelected ? 'checked' : 'unchecked'}
                  onPress={() => setCheckboxSelected(!checkboxSelected)}
                />
                <Text style={styles.checkboxText}>
                  Al presionar confirmar usted acepta nuestros terminos y condiciones
                </Text>
              </View>
              <View style={styles.buttonBox}>
                <Button
                  appearance='filled'
                  color={colors.primary}
                  handleClick={handleSubmit}
                  rounded
                  elevated={!checkboxSelected}
                  disabled={!checkboxSelected} // Deshabilita el botón si el checkbox no está seleccionado
                >
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
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20
  },
  checkboxText: {
    fontSize: 10,
    color: colors.secondaryTextColor,
    flexShrink: 1
  }
})
