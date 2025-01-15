/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react'
import { Dimensions, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import Logo from '../../../../logo.svg'
import TextField from '../TextField'
import { Formik } from 'formik'
import { Checkbox } from 'react-native-paper'
import * as Yup from 'yup'

import Button from '@ui/components/Button'
import ModalTermCond from '@ui/components/ModalTermCond'
import Title from '@ui/tipografy/Title'

import colors from '@config/theme/colors'

const { width, height } = Dimensions.get('window')

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
  const [modalVisible, setModalVisible] = useState<boolean>(false)

  const handleLogin = () => {
    navigation.navigate('Login')
  }
  const handleAccept = () => {
    setModalVisible(false)
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
                  Al presionar confirmar usted acepta nuestros{' '}
                  <Text style={styles.linkText} onPress={() => setModalVisible(true)}>
                    términos y condiciones
                  </Text>
                  .
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
      <ModalTermCond
        modalVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        title='Términos y Condiciones de Uso'
        content={
          'Bienvenida a INCLUD, una aplicación móvil desarrollada por la Asociación Colectiva de Mujeres para El Desarrollo Local, asociación Sin Fines de Lucro con sede en El Salvador. Esta plataforma ha sido creadapara ofrecer información y recursos sobre sobre educación integral, salud emocional y prevención de violencia, además posibilita el acceso a espacios que brindan atención psicológica y asistencia legal para personas mayores de 18 años. Al acceder o utilizar esta aplicación, aceptas cumplir con los Términos y Condiciones establecidas para las mismas, así como los cambios que puedan tener en un futuro. Si no estás de acuerdo con estos términos, por favor, no uses nuestros servicios. \n\n 1. Aceptación de los Términos \nAl utilizar INCLUD, aceptas estos Términos y Condiciones en su totalidad. Si no estás de acuerdo con alguno de los términos, no podrás utilizar nuestros servicios. Nos reservamos el derecho de actualizar o modificar estos términos, en cualquier momento, sin previo aviso.\n\n2. Descripción de los Servicios \nINCLUD proporciona información sobre Educación Integral, Salud Emocional, Prevención de Violencia e información sobre cómo encontrar espacios de organizaciones y/o instituciones cercanas a los departamentos de tu residencia a través un directorio nacional se brinda seguimiento a personas mayores de 18 años, con el objetivo de brindar acceso a recursos educativos, ubicaciones cercanas de organizaciones e instituciones aliadas que brinden servicios de atención y otras herramientas relacionadas con cada usuario. Los servicios de esta aplicación están destinados a brindar información, recursos educativos, el empoderamiento y el apoyo de las personas mayores de 18 años en temas de Educación Integral, Salud Emocional y Prevención de Violencia.\n\n3. Uso Aceptable\nAl utilizar nuestra aplicación, te comprometes a: \n- Usar la aplicación de manera responsable y conforme a las leyes aplicables.\n- No infringir los derechos de propiedad intelectual de INCLUD o de terceros.\n- No utilizar la aplicación para realizar actividades ilegales, dañinas, abusivas, acosadoras o que violenten los derechos de otras personas.\n- No compartir contenido que sea difamatorio, obsceno, vulgar, discriminatorio o que incite al odio o la violencia.\n\n4. Registro de Personas Usuarias\nPara acceder a ciertos servicios o funciones de la aplicación, es necesario registrarte y proporcionar la información que se solicite. Entre otros, te comprometes a:\n- Proveer información precisa y veraz durante el proceso de registro.\n- Mantener actualizada tu información de cuenta.\n- Proteger tu cuenta de accesos no autorizados.\n- Dar aviso al correo electrónico app.includ@gmail.com, en caso de tener conocimiento del uso indebido de esta plataforma.\n\n5. Privacidad y Protección de Datos \nTu privacidad es muy importante para nosotros. La recopilación, el uso y la protección de tus datos personales están sujetos a nuestra Política de Privacidad, que puedes consultar en el SITIO WEB DE LA APLICACIÓN.\n\n6. Derechos de Propiedad Intelectual\nTodos los derechos de propiedad intelectual sobre el contenido de la aplicación, incluyendo pero no limitado a textos, gráficos, logotipos, imágenes, software y marcas registradas, son propiedad de la Asociación Colectiva de Mujeres para El Desarrollo Local, de El Salvador. Queda prohibida la reproducción, distribución o uso no autorizado del contenido de la aplicación.\n\n7. Exención de Responsabilidad\nInformación educativa: La información proporcionada a través de la aplicación tiene fines informativos, educativos y de apoyo. No debe considerarse un sustituto de asesoramiento médico profesional, diagnóstico o tratamiento. Siempre consulta con un profesional para cualquier problema relacionado con tu salud e integridad.\nLimitación de responsabilidad: INCLUD no se hace responsable de cualquier daño o pérdida que pueda surgir como resultado del uso de la aplicación o de la información proporcionada en ella.\n\n8. Suspensión o Eliminación de la Cuenta\nNos reservamos el derecho de suspender o eliminar tu cuenta de usuario, si consideramos que se han violado estos Términos y Condiciones, o si participas en actividades que puedan dañar la reputación o funcionamiento de la aplicación.\n\n9. Enlaces a Terceros\nNuestra aplicación puede contener enlaces a sitios web o servicios de terceros. No somos responsables de los contenidos, políticas de privacidad o prácticas de esos sitios o servicios. Te recomendamos leer los términos y condiciones y la política de privacidad de cada sitio web de terceros que visites.\n\n10. Modificaciones de los Términos\nNos reservamos el derecho de modificar o actualizar estos Términos y Condiciones en cualquier momento. Cualquier cambio será publicado en esta sección, y la fecha de la última actualización será indicada al final de este documento. Es tu responsabilidad revisar periódicamente estos términos para estar al tanto de cualquier cambio.\n\n11. Ley Aplicable y Resolución de Disputas\nEstos Términos y Condiciones se rigen por las leyes de El Salvador. Cualquier disputa que surja en relación con el uso de la aplicación se resolverá mediante lo establecido en la Constitución de la República de El Salvador, artículo 2, relativo al Derecho a la intimidad personal y familiar y de la propia imagen, así como de acuerdo a la Ley de Acceso a la Información Pública, artículo 7 y 24 letra a); y el capítulo especial para la protección de datos personales de dicha ley, regulado desde el artículo 31 y siguientes, lo dispuesto en la Ley de Protección al Consumidor y lo establecido en el artículo 33 y 103 de la Ley Crecer Juntos para la Protección Integral de la Primera Infancia, Niñez y Adolescencia.\n\nPor este medio hacemos de tu conocimiento los Términos y Condiciones de la aplicación móvil INCLUD. Si tienes alguna pregunta o inquietud acerca de estos Términos y Condiciones, puedes contactarnos a través de app.includ@gmail.com'
        }
        onAccept={handleAccept}
      />
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
  linkText: {
    color: 'blue',
    textDecorationLine: 'underline'
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
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    width: width * 0.9,
    height: height * 0.8,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    justifyContent: 'space-between'
  },
  scrollContent: {
    paddingBottom: 20
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333'
  },
  modalText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
    textAlign: 'justify'
  },
  acceptButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 15,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 20
  },
  acceptButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  }
})
