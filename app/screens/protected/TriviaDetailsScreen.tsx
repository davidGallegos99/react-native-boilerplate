import React from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import Logo from '../../../logo.svg'
import { RouteProp } from '@react-navigation/native'

import { RootStackParamList } from '@screens/SignUpOptsScreen'

import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'

type TriviaDetailsRouteProp = RouteProp<RootStackParamList, 'TriviaDetails'>

type TriviaDetailsProps = {
  route: TriviaDetailsRouteProp
}

const TriviaDetailsScreen: React.FC<TriviaDetailsProps> = ({ route }) => {
  const { moduleName, trivias } = route.params
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.logoContainer}>
        <Logo width={125} height={125} />
      </View>
      <Text style={styles.moduleTitle}>{moduleName.toUpperCase()}</Text>
      <View style={styles.triviasContainer}>
        {trivias.map(trivia => (
          <TouchableOpacity
            key={trivia.id}
            style={styles.triviaCard}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Game', { screen: "Trivia", params: { idTrivia: trivia.id } })}>
            <Text style={styles.triviaName}>{trivia.trivia_name.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 20
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20
  },
  moduleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A148C',
    textAlign: 'center',
    marginBottom: 20,
    backgroundColor: '#EDE7FE',
    paddingVertical: 10,
    borderRadius: 10,
    padding: 10
  },
  triviasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  triviaCard: {
    backgroundColor: '#EDE7FE',
    width: '45%',
    height: 200,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5
  },
  triviaName: {
    margin:3,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4A148C',
    textAlign: 'center',
    paddingHorizontal: 5
  }
})

export default TriviaDetailsScreen
