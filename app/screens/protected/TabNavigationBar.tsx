/* eslint-disable react/no-unstable-nested-components */
import { useEffect } from 'react'
import { StyleSheet } from 'react-native'

import Directorio from '../../assets/icons/directorio.svg'
import Inicio from '../../assets/icons/home.svg'
import Juegos from '../../assets/icons/juegos.svg'
import Perfil from '../../assets/icons/perfil.svg'
import Videos from '../../assets/icons/videos.svg'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'

import DirectoryScreen from './Directory/DirectoryScreen'
import JuegosScreen from './Game/Menu'
import { HomeScreen } from './HomeScreen'
import ProfileInformation from './ProfileInformation'
import VideosScreen from './VideosScreen'

// Importamos el componente Trivia

export function TabNavigationBar() {
  const Tab = createBottomTabNavigator()
  const JuegosStack = createStackNavigator()

  const JuegosStackScreen = () => (
    <JuegosStack.Navigator>
      <JuegosStack.Screen
        name='JuegosScreen'
        component={JuegosScreen}
        options={{
          headerShown: false,
          title: 'JuegosScreen'
        }}
      />
    </JuegosStack.Navigator>
  )

  useEffect(() => {
    const logAllStorageItems = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys()
        if (keys.length === 0) {
          return
        }
        const items = await AsyncStorage.multiGet(keys)
        items.forEach(([key, value]) => {
          console.log(`Clave: ${key}, Valor: ${value}`)
        })
      } catch (error) {
        console.error('🚀 ~ Error al obtener los datos de AsyncStorage:', error)
      }
    }
    logAllStorageItems()
  }, [])

  return (
    <Tab.Navigator
      initialRouteName='Inicio'
      screenOptions={({ route }) => ({
        header: () => null,
        tabBarStyle: styles.tabBar,
        tabBarActiveBackgroundColor: '#cfb5d5',
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: '#9D47B2',
        tabBarIconStyle: { marginTop: 16 },
        tabBarLabelStyle: { fontWeight: 700, paddingBottom: 13 },
        tabBarShowLabel: false, // Oculta los labels

        tabBarIcon() {
          switch (route.name) {
            case 'Home':
              return <Inicio />
            case 'Directorio':
              return <Directorio />
            case 'Videos':
              return <Videos />
            case 'Juegos':
              return <Juegos />
            case 'Perfil':
              return <Perfil />
            default:
              break
          }

          return <Inicio />
        }
      })}
    >
      <Tab.Screen name='Videos' component={VideosScreen} />
      <Tab.Screen name='Juegos' component={JuegosScreen} />
      <Tab.Screen name='Inicio' options={{ unmountOnBlur: true }} component={HomeScreen} />
      <Tab.Screen name='Directorio' component={DirectoryScreen} />
      <Tab.Screen name='Perfil' options={{ unmountOnBlur: true }} component={ProfileInformation} />
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  tabBar: {
    shadowOffset: {
      width: 0,
      height: 222
    },
    shadowOpacity: 0.58,
    shadowRadius: 6.0,
    elevation: 44,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: '#fff',
    position: 'absolute',
    color: 'red',
    bottom: 0,
    width: '100%',
    height: 104
  }
})
