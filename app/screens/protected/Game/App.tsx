import React from 'react'

import { createStackNavigator } from '@react-navigation/stack'

import CrucigramaScreen from './Crucigrama'
import PlantillaScreen from './Parejas'
import TriviaScreen from './Trivia'

const Stack = createStackNavigator()

const GameApp = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#fff' },
        headerTintColor: '#9D47B2',
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        headerTitleStyle: { fontWeight: 'bold' },
        headerBackTitle: 'Atrás'
      }}
    >
      <Stack.Screen name='Trivia' component={TriviaScreen} options={{ title: 'Trivia', headerShown: false }} />
      <Stack.Screen
        name='Crucigrama'
        component={CrucigramaScreen}
        options={{ title: 'Crucigrama', headerShown: false }}
      />
      <Stack.Screen name='Parejas' component={PlantillaScreen} options={{ title: 'Parejas', headerShown: false }} />
    </Stack.Navigator>
  )
}

export default GameApp
