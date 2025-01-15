import React, { useEffect, useState } from 'react'
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import Loader from '../../ui/components/Loader'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { StackNavigationProp } from '@react-navigation/stack'
import { IGetGeneralUser, IUpdateUserInfo } from 'interfaces/CreateUser.interface'
import { Asset, ImageLibraryOptions, launchCamera, launchImageLibrary } from 'react-native-image-picker'
import { useToast } from 'react-native-toast-notifications'
import Icon from 'react-native-vector-icons/MaterialIcons'

import { getUserInfo } from '@services/GetUserInfo.service'
import { updateUserInformation } from '@services/setUserUpdate'

import api from '@config/axiosConfig'

import { isNotEmptyObject } from '@utils/helpers'

import { RootStackParamList } from '@screens/RegisterScreen'

import { ProfileInfo } from './ProfileInfo'

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>

interface Props {
  navigation: ProfileScreenNavigationProp
}

const ProfileInformation = ({ navigation }: Props) => {
  const toast = useToast()
  const [userInformation, setUserInformation] = useState<IGetGeneralUser | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [showUserForm, setShowUserForm] = useState<boolean>(false)
  const [showProtocols, setShowProtocols] = useState<boolean>(false)
  const [selectedAvatar, setselectedAvatar] = useState<string | undefined>()

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('jwt')
      await AsyncStorage.clear()
      navigation.navigate('SignUpOpts')
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al cerrar sesión. Intenta de nuevo.')
    }
  }

  const handlePersonalInfo = () => setShowUserForm(true)
  const handleProcotols = () => setShowProtocols(true)

  const handleCalendar = () => {
    navigation.navigate('Calendar')
  }
  const handleBack = () => {
    navigation.navigate('Main')
  }

  const handleProtocols = () => console.log('Go to Protocols')

  const getUserData = async () => {
    try {
      const userData = await getUserInfo()
      setUserInformation(userData)
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los datos del usuario.')
    } finally {
      setLoading(false)
    }
  }

  const uploadImageBlob = async (file: Asset) => {
    const formData = new FormData()
    formData.append('image', {
      uri: file.uri,
      type: file.type,
      name: file.fileName
    })

    try {
      const token = await AsyncStorage.getItem('jwt')

      const response = await fetch('http://159.223.132.11/api/auth/profile/avatar', {
        body: formData,
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      })
      toast.show('Avatar actualizado exitosamente.', {
        type: 'success',
        placement: 'top',
        duration: 4000,
        animationType: 'slide-in'
      })
    } catch (error: any) {
      toast.show('Error al subir la imagen.', {
        type: 'error',
        placement: 'top',
        duration: 4000,
        animationType: 'slide-in'
      })
      throw error
    }
  }

  const updateInformation = async (data: IUpdateUserInfo) => {
    if (isNotEmptyObject(data)) {
      const reponse = await updateUserInformation(data)
      toast.show('Datos actualizados con exito', {
        type: 'success',
        placement: 'top',
        duration: 4000,
        animationType: 'slide-in'
      })
      setUserInformation({ data: { ...reponse.user } })
    }
    setShowUserForm(false)
  }

  const selectImage = async () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      quality: 1
    }

    const result = await launchImageLibrary(options)

    if (result.didCancel) {
    } else if (result.assets) {
      const selectedImage = result.assets[0]
      uploadImageBlob(selectedImage)
      setselectedAvatar(selectedImage.uri)
      return selectedImage
    }
  }

  const openCamera = async () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      quality: 1
    }

    const result = await launchCamera(options)

    if (!result.didCancel && result.assets) {
      const selectedImage = result.assets[0]
      uploadImageBlob(selectedImage)
      setselectedAvatar(selectedImage.uri) // Guardar la URI de la imagen tomada
    }
  }

  const handleImageSelection = () => {
    Alert.alert('Seleccionar Imagen', '¿Deseas usar la Cámara o la Galería?', [
      {
        text: 'Cámara',
        onPress: () => openCamera() // Abre la cámara
      },
      {
        text: 'Galería',
        onPress: () => selectImage() // Abre la galería
      },
      {
        text: 'Cancelar',
        style: 'cancel'
      }
    ])
  }

  useEffect(() => {
    getUserData()
  }, [])

  if (loading) {
    return <Loader loading />
  }
  console.log('userInformation :>> ', userInformation)
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          {/* <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Icon name='arrow-back' size={24} color='white' />
          </TouchableOpacity> */}
          <Text style={styles.title}>Mi perfil</Text>
          <View style={styles.imageContainer}>
            <TouchableOpacity onPress={handleImageSelection}>
              <Image
                source={{
                  uri: selectedAvatar || userInformation?.data?.avatar || 'https://via.placeholder.com/100'
                }}
                style={styles.profileImage}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.editIcon} onPress={handleImageSelection}>
              <Icon name='camera-alt' size={18} color='white' />
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>{userInformation?.data?.name ?? 'No name available'}</Text>
          <Text style={styles.email}>{userInformation?.data?.email ?? 'No email available'}</Text>
        </View>
        <View style={styles.body}>
          {!showUserForm ? (
            <>
              <View
                style={[
                  styles.contentContainer,
                  userInformation?.data?.gender?.id == 2 ? styles.gender2 : styles.default
                ]}
              >
                <TouchableOpacity style={styles.button} onPress={handlePersonalInfo}>
                  <Icon name='person' size={45} color='#6A1B9A' />
                  <Text style={styles.buttonText}>Información personal</Text>
                </TouchableOpacity>
                {userInformation?.data?.gender?.id == 2 && (
                  <TouchableOpacity style={styles.button} onPress={handleCalendar}>
                    <Icon name='calendar-today' size={45} color='#6A1B9A' />
                    <Text style={styles.buttonText}>Calendario Menstrual/Hormonal</Text>
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.footer}>
                <View>
                  <TouchableOpacity style={styles.footerButton} onPress={handleProtocols}>
                    <Icon name='security' size={20} color='#6A1B9A' />
                    <Text style={styles.footerText}>Protocolos de seguridad</Text>
                  </TouchableOpacity>
                </View>
                <View>
                  <TouchableOpacity style={styles.footerButton} onPress={handleLogout}>
                    <Icon name='logout' size={20} color='#6A1B9A' />
                    <Text style={styles.footerText}>Cerrar Sesión</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          ) : (
            <ProfileInfo userInformation={userInformation} onSubmit={updateInformation} />
          )}
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#6A1B9A'
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBottom: 20
  },

  gender2: {
    justifyContent: 'space-between',
    paddingBottom: 100
  },

  default: {
    justifyContent: 'center',
    paddingBottom: 200
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF'
  },
  loadingText: {
    marginTop: 10,
    color: '#6A1B9A',
    fontSize: 16,
    fontWeight: 'bold'
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#6A1B9A'
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10
  },
  imageContainer: {
    marginTop: 20,
    alignItems: 'center'
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#FFF'
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: -10,
    backgroundColor: '#6A1B9A',
    padding: 5,
    borderRadius: 15
  },
  name: {
    fontSize: 18,
    color: '#FFF',
    marginTop: 10,
    fontWeight: 'bold'
  },
  email: {
    fontSize: 14,
    color: '#FFF',
    marginTop: 5
  },
  body: {
    backgroundColor: '#F8F8F8',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignItems: 'center',
    paddingTop: 50,
    // Ajustar justifyContent
    justifyContent: 'flex-start',
    paddingBottom: 20
  },
  button: {
    backgroundColor: '#F3E5F5',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: 150
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#6A1B9A',
    fontWeight: 'bold'
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 10,
    backgroundColor: '#F8F8F8',
    marginBottom: 30
  },
  footerButton: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center'
  },
  footerText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#6A1B9A'
  }
})

export default ProfileInformation
