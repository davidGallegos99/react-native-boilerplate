import { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import Logo from '../../../../logo.svg'
import Loader from '../../../ui/components/Loader'
import { ScrollView } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/MaterialIcons'

import Button from '@ui/components/Button'
// import DataFilterActions from '@ui/components/DataFilterActions'
import SpecialistList from '@ui/components/SpeclistList'

import { Directory, GetDirectoriesByZone } from '@services/directories/GetDirectoriesByZone.service'
import { Zone } from '@services/directories/GetZones.service'

import colors from '@config/theme/colors'

interface DirectorySpecialistsProps {
  zone: Zone
  goBack: () => void
}

function DirectorySpecialists({ zone, goBack }: DirectorySpecialistsProps) {
  const [directories, setdirectories] = useState<Directory[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const getDirectories = async () => {
    try {
      const res = await GetDirectoriesByZone(zone)
      setdirectories(res.data)
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getDirectories()
  }, [])

  if (loading) {
    return <Loader loading />
  }
  return (
    <ScrollView
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={true} // Opcional, para mostrar la barra de scroll
    >
      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <Icon name='arrow-back' size={24} color='#6A1B9A' />
        <Text style={styles.backButtonText}>Volver</Text>
      </TouchableOpacity>
      <View style={styles.item}>
        <Logo width={125} height={125} />
      </View>
      <View style={{ width: '50%', marginTop: 45 }}>
        <Button elevated appearance='filled' customRadius={22} color={colors.primary}>
          {zone.zone_name}
        </Button>
      </View>
      <SpecialistList data={directories} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1, // Permite que el contenido crezca y haga scroll
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 30
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    marginTop: 10,
    marginBottom: 20
  },
  backButtonText: {
    color: '#6A1B9A',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10
  },
  item: { justifyContent: 'center', alignItems: 'center', marginTop: 20 }
})

export default DirectorySpecialists
