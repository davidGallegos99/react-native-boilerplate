import React, { useEffect, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import BootSplash from 'react-native-bootsplash'
import 'react-native-gesture-handler'
import { PaperProvider } from 'react-native-paper'
import { ToastProvider } from 'react-native-toast-notifications'

import { Header } from '@ui/components/Header'

import Description1Screen from '@screens/Description1'
import Description2Screen from '@screens/Description2'
import Description3Screen from '@screens/Description3'
import LoginScreen from '@screens/LoginScreen'
import RegisterScreen from '@screens/RegisterScreen'
import SignUpOptsScreen from '@screens/SignUpOptsScreen'
import WelcomeScreen from '@screens/WelcomeScreen'
import { ProfileScreen } from '@screens/protected/ProfileScreen'
import { TabNavigationBar } from '@screens/protected/TabNavigationBar'

import GameNavigator from "@screens/protected/Game/App"

import Loader from './ui/components/Loader'

const App: React.FC = () => {
  const Stack = createStackNavigator()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('jwt')
      setIsAuthenticated(!!token)
      await BootSplash.hide({ fade: true })
    }
    checkAuth()
  }, [])

  if (isAuthenticated === null) {
    return <Loader loading={isAuthenticated === null} />
  }

  return (
    <ToastProvider>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName={isAuthenticated ? 'Main' : 'SignUpOpts'}>
            {/* Rutas públicas */}
            <Stack.Screen name='SignUpOpts' options={{ headerShown: false }} component={SignUpOptsScreen} />
            <Stack.Screen name='Register' options={{ headerShown: false }} component={RegisterScreen} />
            <Stack.Screen name='Login' options={{ headerShown: false }} component={LoginScreen} />
            <Stack.Screen name='Welcome' options={{ headerShown: false }} component={WelcomeScreen} />
            <Stack.Screen name='Description1' options={{ headerShown: false }} component={Description1Screen} />
            <Stack.Screen name='Description2' options={{ headerShown: false }} component={Description2Screen} />
            <Stack.Screen name='Description3' options={{ headerShown: false }} component={Description3Screen} />

            {/* Ruta protegida */}
            <Stack.Screen name='Main' options={{ headerShown: false }} component={TabNavigationBar} />
            <Stack.Screen name='Calendar' options={{ headerShown: false }} component={ProfileScreen} />

            <Stack.Screen name="Game" options={{headerShown:false}} component={GameNavigator} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </ToastProvider>
  )
}

export default App
