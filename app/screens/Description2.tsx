import React from 'react'
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import Logo from '../../logo.svg'
import useAuthStore from '../store/useAuthStore'
import { StackNavigationProp } from '@react-navigation/stack'
import Icon from 'react-native-vector-icons/Ionicons'

import colors from '@config/theme/colors'

import { LayoutUtils } from '@utils/layout'

import { RootStackParamList } from './SignUpOptsScreen'

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Description2'>
interface Props {
  navigation: RegisterScreenNavigationProp
}

const { height, width } = Dimensions.get('window')

const Description2Screen = ({ navigation }: Props) => {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Logo width={150} height={150} />
        </View>
        <Text style={styles.loadingText}>
          La Colectiva Feminista junto con la Fundación Heinrich Böll, la Asociación de Investigación y Especialización
          sobre Temas Iberoamericanos (AIETI), Fundación de Ayuda contra la Drogadicción (FAD), pensamos en una
          propuesta para hablar acerca de nuestros derechos, emociones y en la necesidad de contar con herramientas para
          prevenir y erradicar las violencias desde la promoción de la Educación Integral en Sexualidad, la equidad e
          inclusión.
        </Text>
        <Text style={styles.loadingText}>
          Creemos firmemente que las juventudes salvadoreñas debemos ejercer una ciudadanía activa, informada y libre de
          violencia. Para ello, hemos contado con el respaldo y apoyo financiero de la Unión Europea y AECID.
        </Text>
        <Text style={styles.loadingText}>
          Informa, comparte y aprende sobre los derechos de las juventudes y las diversidades. El conocimiento es una
          herramienta poderosa.
        </Text>
        <Text style={styles.footerTextTitle}>Recuerda, las redes salvan.</Text>
        <Text style={styles.footerText}>¡Actúa, sueña y transforma!</Text>

        <View style={styles.stepProgressContainer}>
          <View style={styles.step} />
          <View style={styles.activeStep} />
          <View style={styles.step} />
        </View>
      </View>

      <TouchableOpacity style={styles.floatingButton} onPress={() => navigation.navigate('Description3')}>
        <Icon name='arrow-forward' size={24} color='#fff' />
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: LayoutUtils.moderateScale(20),
    minHeight: height,
    width: '100%'
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30
  },
  stepProgressContainer: {
    flexDirection: 'row',
    gap: 29,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25
  },
  activeStep: {
    width: 33,
    height: 33,
    borderRadius: 50,
    backgroundColor: colors.stepColor
  },
  step: {
    width: 16,
    height: 16,
    borderRadius: 50,
    backgroundColor: colors.stepColor
  },
  loadingText: {
    fontSize: LayoutUtils.scaleFontSize(14),
    color: '#000000',
    fontWeight: '300',
    lineHeight: 22,
    textAlign: 'justify',
    width: '90%'
  },
  footerTextTitle: {
    marginTop: 10,
    width: '90%',
    fontSize: LayoutUtils.moderateScale(18),
    textAlign: 'center',
    color: colors.secondaryTextColor
  },
  footerText: {
    width: '90%',
    fontSize: LayoutUtils.moderateScale(20),
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.secondaryTextColor,
    marginBottom: LayoutUtils.moderateScale(20)
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    backgroundColor: colors.primary,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5
  }
})

export default Description2Screen
