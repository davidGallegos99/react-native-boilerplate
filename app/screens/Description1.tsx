import React from 'react'
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import Logo from '../../logo.svg'
import useAuthStore from '../store/useAuthStore'
import { StackNavigationProp } from '@react-navigation/stack'
import Icon from 'react-native-vector-icons/Ionicons'

import colors from '@config/theme/colors'

import { LayoutUtils } from '@utils/layout'

import { RootStackParamList } from './SignUpOptsScreen'

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Description1'>
interface Props {
  navigation: RegisterScreenNavigationProp
}

const { height, width } = Dimensions.get('window')

const Description1Screen = ({ navigation }: Props) => {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Logo width={200} height={200} />
        </View>
        <Text style={styles.welcomeText}>¡Bienvenidas/os/es!</Text>

        <Text style={styles.loadingText}>¡Nos alegra e inspira el tenerte en nuestra comunidad INCLUD! </Text>
        <Text style={styles.loadingText}>
          Esta plataforma ha sido diseñada para ofrecerte una experiencia única y fácil de usar, en la cual podrás
          encontrar todo lo que necesitas para conocer más sobre tus derechos y acceder a información sobre servicios,
          al alcance de tu mano. No dudes en explorar todas las funciones que hemos preparado para ti y en contactarnos
          si necesitas apoyo. Recuerda que cuando nos juntamos somos más fuertes.
        </Text>

        <Text style={styles.footerText}>¡Luchemos por un mundo más justo e inclusivo para todas y todes!</Text>

        <View style={styles.stepProgressContainer}>
          <View style={styles.activeStep} />
          <View style={styles.step} />
        </View>
      </View>

      <TouchableOpacity style={styles.floatingButton} onPress={() => navigation.navigate('Description2')}>
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
    paddingTop: 80,
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
  welcomeText: {
    fontSize: LayoutUtils.moderateScale(24),
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.secondaryTextColor,
    marginBottom: LayoutUtils.moderateScale(10),
    width: '90%'
  },
  loadingText: {
    fontSize: LayoutUtils.scaleFontSize(16),
    color: '#000000',
    fontWeight: '300',
    lineHeight: 22,
    textAlign: 'justify',
    width: '90%'
  },
  footerText: {
    marginTop: 10,
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

export default Description1Screen
