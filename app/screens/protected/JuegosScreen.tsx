import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import Logo from '../../../logo.svg'
import { StackNavigationProp } from '@react-navigation/stack'
import { ScrollView } from 'react-native-gesture-handler'

import { RootStackParamList } from '@screens/SignUpOptsScreen'

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TriviaScreen'>
interface Props {
  navigation: RegisterScreenNavigationProp
}
function LudotecaScreen({ navigation }: Props) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.logoContainer}>
        <Logo width={125} height={125} />
      </View>
      <Text style={styles.title}>LUDOTECA</Text>
      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('TriviaModulesScreen')}>
          <Text style={styles.cardText}>TRIVIAS</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('MainGame')}>
          <Text style={styles.cardText}>JUEGOS</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20
  },
  logoContainer: {
    marginTop: 38,
    marginBottom: 20
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6600',
    marginBottom: 30
  },
  optionsContainer: {
    width: '100%'
  },
  card: {
    backgroundColor: '#EDE7FE',
    height: '33%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5
  },
  cardText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A148C'
  }
})

export default LudotecaScreen
