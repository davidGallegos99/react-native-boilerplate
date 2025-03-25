import React from 'react'

import { createStackNavigator } from '@react-navigation/stack'

import NoEncontradoScreen from './NoEncontrado'
import TriviaScreen from './Trivia'
import SopaLetrasScreen from './SopaLetras'
import ParejasScreen from './Parejas'
import CrucigramaScreen from './Crucigrama'
import BuscaPalabraScreen from './BuscaPalabra'

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
      <Stack.Screen name='no encontrado' component={NoEncontradoScreen} options={{ title: 'NO ENCONTRADO',headerShown:true}} />
      <Stack.Screen name='Trivia' component={TriviaScreen} options={{ title: 'Trivia',headerShown:false}} />
      <Stack.Screen name='SopaLetras' component={SopaLetrasScreen} options={{ title: 'Equipaje de género',headerShown:false}} />
      <Stack.Screen name='Parejas' component={ParejasScreen} options={{ title: 'EmotiMatch',headerShown:false}} />
      <Stack.Screen name='Crucigrama' component={CrucigramaScreen} options={{ title: 'ITS',headerShown:false}} />
      <Stack.Screen name='BuscaPalabra' component={BuscaPalabraScreen} options={{ title: 'Busca palabras',headerShown:false}} />
    </Stack.Navigator>
  )
}

export default GameApp
