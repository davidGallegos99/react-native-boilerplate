import React, { useEffect, useState } from 'react'
import { Alert, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import Loader from '../../ui/components/Loader'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { StackNavigationProp } from '@react-navigation/stack'
import { IGetGeneralUser, IUpdateUserInfo } from 'interfaces/CreateUser.interface'
import { Asset, ImageLibraryOptions, launchCamera, launchImageLibrary } from 'react-native-image-picker'
import ImageResizer from 'react-native-image-resizer'
import { useToast } from 'react-native-toast-notifications'
import Icon from 'react-native-vector-icons/MaterialIcons'

import { getUserInfo } from '@services/GetUserInfo.service'
import { updateUserInformation } from '@services/setUserUpdate'

import api from '@config/axiosConfig'

import { isNotEmptyObject } from '@utils/helpers'

import { RootStackParamList } from '@screens/RegisterScreen'

import notPic from '@assets/images/10.png'

import { ProfileInfo } from './ProfileInfo'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window') // Obtener dimensiones del dispositivo

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

  const handleBackToInitial = () => {
    setShowUserForm(false)
    setShowProtocols(false)
  }

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('jwt')
      await AsyncStorage.clear()
      navigation.navigate('SignUpOpts')
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al cerrar sesión. Intenta de nuevo.')
    }
  }

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
    if (!file?.uri) {
      console.error('⚠️ La imagen capturada no tiene una URI válida:', file)
      toast.show('Error al capturar la imagen.', {
        type: 'danger',
        placement: 'top',
        duration: 4000,
        animationType: 'slide-in'
      })
      return
    }
    const resizedImage = await ImageResizer.createResizedImage(file.uri, 1000, 1000, 'JPEG', 80, 0)
    const formattedUri = resizedImage.uri.startsWith('file://') ? resizedImage.uri : `file://${resizedImage.uri}`
    const fileName = `avatar_${Date.now()}.jpg`

    const formData = new FormData()
    formData.append('image', {
      uri: formattedUri,
      name: fileName,
      type: 'image/jpeg'
    })

    try {
      const token = await AsyncStorage.getItem('jwt')

      const response = await fetch('https://includ.app/api/auth/profile/avatar', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data'
        },
        body: formData
      })

      const textResponse = await response.text()
      const responseBody = JSON.parse(textResponse)
      if (response.ok && responseBody?.user?.avatar) {
        setUserInformation(prev =>
          prev?.data ? { ...prev, data: { ...prev.data, avatar: responseBody.user.avatar ?? prev.data.avatar } } : prev
        )

        toast.show('Avatar actualizado exitosamente.', {
          type: 'success',
          placement: 'top',
          duration: 4000,
          animationType: 'slide-in'
        })
      } else {
        throw new Error(responseBody?.message || 'Error al subir la imagen')
      }
    } catch (error: any) {
      console.error('❌ Error en la subida:', error?.message)
      toast.show(error?.message || 'Error al subir la imagen.', {
        type: 'danger',
        placement: 'top',
        duration: 4000,
        animationType: 'slide-in'
      })
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
      setselectedAvatar(selectedImage.uri)
    }
  }

  const handleImageSelection = () => {
    Alert.alert('Seleccionar Imagen', '¿Deseas usar la Cámara o la Galería?', [
      {
        text: 'Cámara',
        onPress: () => openCamera()
      },
      {
        text: 'Galería',
        onPress: () => selectImage()
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

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackToInitial}>
            <Icon name='arrow-back' size={24} color='white' />
          </TouchableOpacity>
          {showProtocols ? (
            <Text style={styles.titleProtocols}>
              {`Consentimiento Informado y\nPolítica de Privacidad\nAplicación INCLUD`}
            </Text>
          ) : (
            <>
              <Text style={styles.title}>Mi Perfil</Text>
              <TouchableOpacity onPress={handleImageSelection}>
                <Image
                  source={userInformation?.data?.avatar ? { uri: userInformation.data.avatar } : notPic}
                  style={styles.profileImage}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.editIcon} onPress={handleImageSelection}>
                <Icon name='camera-alt' size={18} color='white' />
              </TouchableOpacity>

              <Text style={styles.name}>{userInformation?.data?.name ?? 'Nombre no disponible'}</Text>
              <Text style={styles.email}>{userInformation?.data?.email ?? 'Correo no disponible'}</Text>
            </>
          )}
        </View>

        {/* Body */}
        <View style={styles.body}>
          {showProtocols ? (
            <View style={styles.protocolContainer}>
              <Text style={{ color: 'black', fontWeight: 600, marginTop: -50 }}>
                {`Consentimiento Informado y Politica de privacidad de aplicación INCLUD \n`}
              </Text>
              <Text style={styles.protocolText}>
                {`Consentimiento Informado y Política de Privacidad de la Aplicación INCLUD Con base a lo establecido en la Constitución de la República de El Salvador en su artículo 2, relativo al Derecho a la intimidad personal y familiar y de la propia imagen, así como a la Ley de Acceso a la Información Pública, artículo 7 y 24 letra a), y el capítulo especial para la protección de datos personales de dicha ley desde el art. 31 y siguientes; lo dispuesto en la Ley de Protección al Consumidor y lo establecido en el artículo 33 y 103 de la Ley Crecer Juntos para la Protección Integral de la Primera Infancia, Niñez y Adolescencia, relacionados al uso de aplicaciones y servicios informáticos sobre educación integral en sexualidad, salud sexual y reproductiva; por este medio hacemos de tu conocimiento la política de privacidad de la aplicación móvil INCLUD.\n\nINCLUD, con Progressive Web Application, COLOCAR EQUIPO DE DESARROLLO EL SITIO WEB, es el responsable del uso y protección de sus datos personales, y al respecto le informamos lo siguiente:\n\n¿Cómo se recaban sus datos personales?\n INCLUD recabará datos personales emitidos por personas usuarias mayores de 18 años, a través de su base de datos de suscriptores y sistema de monitoreo de registro de la aplicación. INCLUD se compromete a hacer un uso responsable de los datos personales obtenidos, y mantener resguardados y confidenciales los datos sensibles. Los datos recolectados serán utilizados durante el período de un año y luego serán eliminados de la plataforma administrada por la Asociación Colectiva de Mujeres para el Desarrollo Local en El Salvador.\n\nLos datos personales que se recaben, serán utilizados para las finalidades que son necesarias, dependiendo de las razones por las que se registran, como:\n • Con fines de investigación\n • Para fines estadísticos\n • Para la creación y/o actualización de base de datos\n • Para apoyar al acceso de servicios psicosociales y jurídicos ofrecidos por la plataforma\n • Como justificante para la rendición de cuentas en cuanto al uso de recursos públicos y privados destinados al programa.\n\nDe manera adicional, se podrá utilizar la información personal para finalidades secundarias del Proyecto, que se consideren o no necesarias para dar apoyo o para colaborar con la organización, pero que permitirán facilitar el trabajo de apoyo y promoción al segmento de usuarios:\n • Para recabar datos estadísticos de carácter nacional y de uso único de la Asociación Colectiva de Mujeres Para el Desarrollo Local.\n • Para la difusión de convocatorias de actividades relacionadas a la App.\n\nEn caso de que no desee que sus datos personales sean tratados para estos fines secundarios, desde este momento usted nos puede comunicar lo anterior a través del siguiente mecanismo:\n Enviar un correo electrónico expresando la solicitud y los motivos para no utilizar sus datos personales para los fines secundarios antes señalados, a la siguiente dirección electrónica: app.includ@gmail.com\n\nLa solicitud de no utilizar sus datos personales para los fines secundarios no afectará el derecho de utilizar la aplicación.\n\n¿Qué datos personales utilizaremos para estos fines?\n Para llevar a cabo las finalidades descritas en el presente aviso de privacidad, utilizaremos alguno o varios de los siguientes datos personales:\n • Nombre\n • Pronombres\n • Fecha de nacimiento\n • Género\n • Departamento de residencia\n • Intereses de búsqueda\n • Correo electrónico y clave de recuperación de cuenta.\n\n¿Con quién compartimos su información personal y para qué fines?\n Le informamos que sus datos personales serán compartidos únicamente dentro de El Salvador, con empleados de la Asociación Colectiva de Mujeres para el Desarrollo Local, para los fines antes dichos. De manera adicional, le informamos que los datos estadísticos emitidos por la aplicación INCLUD serán utilizados para fines de monitoreo en el marco de la rendición de cuentas ante agencias financiadoras identificadas dentro de la aplicación.\n\nConsentimiento informado ¿Cómo puedo acceder, rectificar o cancelar mis datos personales, u oponerme a su uso?\n Cada usuario tiene derecho a conocer qué datos personales tenemos de usted, para qué los utilizamos y las condiciones del uso que les damos (Acceso). Asimismo, es su derecho solicitar la corrección de su información personal en caso de que esté desactualizada, sea inexacta o incompleta (Rectificación); a solicitar su eliminación de nuestros registros o bases de datos, cuando considere que la misma no está siendo utilizada adecuadamente (Cancelación); así como oponerse al uso de sus datos personales para fines específicos (Oposición).\n\nPara el ejercicio de cualquiera estas acciones, usted deberá enviar un correo electrónico a app.includ@gmail.com, manifestando la situación específica, y en caso de considerar que es por motivos de no estar siendo utilizada bajo los términos dichos, señalar la situación que haya sido de su conocimiento para considerarlo de tal manera y poder hacer las consideraciones e investigaciones del caso.\n\nCada usuario podrá revocar su consentimiento para el uso de sus datos personales, bajo los conceptos y procedimientos antes mencionados. Sin embargo, es importante que tenga en cuenta que no en todos los casos podremos atender su solicitud o concluir el uso de forma inmediata, ya que es posible que por alguna obligación legal requiramos seguir tratando sus datos personales. Asimismo, deberá considerar que para ciertos fines, la revocación de su consentimiento implicará que no pueda seguir interactuando con los contenidos dentro de la aplicación.\n\nCambios en el aviso de privacidad.\n El presente aviso de privacidad puede sufrir modificaciones, cambios o actualizaciones derivadas de nuevos requerimientos legales, de las propias necesidades para la información y servicios que se ofrecen por medio de la App, por las prácticas de privacidad, por cambios en nuestro modelo de trabajo, u otras causas debidamente justificadas.\n\nNos comprometemos a mantener la información actualizada en nuestra Página Web: https://includ.app/\n\nPara cualquier aclaración relacionada con la información aquí expuesta, así como para conocer el Aviso de Privacidad en su totalidad, puede enviar un correo electrónico a app.includ@gmail.com `}
              </Text>
            </View>
          ) : !showUserForm ? (
            <>
              <View style={styles.optionContainer}>
                <TouchableOpacity style={styles.optionButton} onPress={() => setShowUserForm(true)}>
                  <Icon name='person' size={30} color='#6A1B9A' />
                  <Text style={styles.optionText}>Información personal</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('Calendar')}>
                  <Icon name='calendar-today' size={30} color='#6A1B9A' />
                  <Text style={styles.optionText}>Calendario Menstrual/Hormonal</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.optionContainer}>
                <TouchableOpacity style={styles.optionButton} onPress={() => setShowProtocols(true)}>
                  <Icon name='security' size={20} color='#6A1B9A' />
                  <Text style={styles.optionText}>Protocolos de seguridad</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.optionButton} onPress={handleLogout}>
                  <Icon name='logout' size={20} color='#6A1B9A' />
                  <Text style={styles.optionText}>Cerrar Sesión</Text>
                </TouchableOpacity>
              </View>

              {/* <View style={styles.footer}>
                <TouchableOpacity style={styles.footerButton} onPress={() => setShowProtocols(true)}>
                  <Icon name='security' size={20} color='#6A1B9A' />
                  <Text style={styles.footerText}>Protocolos de seguridad</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.footerButton} onPress={handleLogout}>
                  <Icon name='logout' size={20} color='#6A1B9A' />
                  <Text style={styles.footerText}>Cerrar Sesión</Text>
                </TouchableOpacity>
              </View> */}
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
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#6A1B9A'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start'
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
    width: screenWidth,
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: '#6A1B9A',
    alignItems: 'center',
    position: 'relative'
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20
  },
  title: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  titleProtocols: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: '18%',
    marginBottom: '18%',
    textAlign: 'center'
  },
  profileImage: {
    width: screenWidth * 0.3,
    height: screenWidth * 0.3,
    borderRadius: screenWidth * 0.15,
    marginVertical: 10,
    borderWidth: 2,
    borderColor: '#FFF'
  },
  editIcon: {
    // position: 'absolute',
    bottom: 40,
    right: -30,
    backgroundColor: '#6A1B9A',
    padding: 5,
    // top: 20,
    borderRadius: 15
  },
  name: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold'
  },
  email: {
    fontSize: 14,
    color: '#FFF'
  },
  body: {
    flex: 1,
    backgroundColor: '#FFF',
    width: screenWidth,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 40,
    alignItems: 'center'
  },
  optionContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: screenWidth * 0.9,
    gap: 20,
    marginBottom: 30
  },
  optionButton: {
    backgroundColor: '#F3E5F5',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 15,
    width: '40%',
    elevation: 5, // Para sombras en Android
    shadowColor: '#000', // Para sombras en iOS
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5
  },
  optionText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6A1B9A',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6A1B9A',
    padding: 15,
    borderRadius: 10,
    width: screenWidth * 0.9,
    marginTop: 20
  },
  logoutText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold'
  },
  protocolContainer: {
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginVertical: 20,
    width: screenWidth * 0.9,
    marginBottom: '10%'
  },
  protocolText: {
    fontSize: 14,
    color: '#000',
    textAlign: 'justify'
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: screenWidth * 0.9,
    paddingTop: 40
  },
  footerButton: {
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
