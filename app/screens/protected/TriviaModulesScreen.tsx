import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import Logo from '../../../logo.svg'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import axios from 'axios'
import { IGetModules, Module } from 'interfaces/Modules.interface'
import { ScrollView } from 'react-native-gesture-handler'

import { GetModules } from '@services/Modules/GetModules.service'

import { RootStackParamList } from '@screens/SignUpOptsScreen'

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TriviaModulesScreen'>
interface Props {
  navigation: RegisterScreenNavigationProp
}

function TriviaModulesScreen({ navigation }: Props) {
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const getModulesLocal = async () => {
    const res = await GetModules()
    setModules(res.data)
    setLoading(false)
  }
  useEffect(() => {
    getModulesLocal()
  }, [])

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#4A148C' />
      </View>
    )
  }

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <View style={styles.logoContainer}>
        <Logo width={125} height={125} />
      </View>
      <View style={styles.modulesContainer}>
        {modules.map(module => (
          <TouchableOpacity
            key={module.id}
            style={styles.cardButton}
            onPress={() =>
              navigation.navigate('TriviaDetails', {
                moduleName: module.module_name,
                trivias: module.learning_objectives.flatMap(objective =>
                  objective.learning_paths.map(path => ({
                    id: path.content.id,
                    trivia_name: path.content.trivia_name
                  }))
                )
              })
            }
          >
            <Text style={styles.cardText}>{module.module_name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF'
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  logoContainer: {
    marginTop: 20,
    alignItems: 'center'
  },
  modulesContainer: {
    marginTop: 20
  },
  card: {
    backgroundColor: '#EDE7FE',
    height: 100,
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
  cardButton: {
    backgroundColor: '#EDE7FE',
    height: 200,
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
    margin: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A148C',
    textAlign: 'center',
    paddingHorizontal: 10
  }
})

export default TriviaModulesScreen
