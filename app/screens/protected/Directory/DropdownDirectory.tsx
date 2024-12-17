import { useEffect, useState } from 'react'
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import Logo from '../../../../logo.svg'
import Loader from '../../../ui/components/Loader'
import Icon from 'react-native-vector-icons/MaterialIcons'

import { GetZones, Zone } from '@services/directories/GetZones.service'

interface DropdownDirectoryProps {
  changeZone: (zone: Zone) => void
  goBack: () => void
}

export function DropdownDirectory({ changeZone, goBack }: DropdownDirectoryProps) {
  const [zones, setZones] = useState<Zone[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const getZones = async () => {
    try {
      const res = await GetZones()
      setZones(res.data)
    } catch (error) {
      console.log(' Error getin Zones:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getZones()
  }, [])

  if (loading) {
    return <Loader loading />
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <Icon name='arrow-back' size={24} color='#6A1B9A' />
        <Text style={styles.backButtonText}>Volver</Text>
      </TouchableOpacity>

      <Logo width={140} height={140} />

      <View style={styles.textContainer}>
        <Text style={styles.description}>
          Explora, conecta y conoce los servicios institucionales de tu localidad a través de INCLUD.
        </Text>
        <Text style={styles.description}>
          Elige la zona que deseas consultar y accede a toda la información que necesitas de forma fácil y rápida.
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.zonesList}>
          {zones.map((zone, index) => (
            <TouchableOpacity key={index} style={styles.zoneItem} onPress={() => changeZone(zone)}>
              <Text style={styles.zoneText}>{zone.zone_name.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingTop: 30 },
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
  textContainer: { marginTop: 20, textAlign: 'justify', paddingHorizontal: 10 },
  description: { fontSize: 15, color: '#6A1B9A', textAlign: 'justify', marginBottom: 5, marginTop: 10 },
  content: { width: '100%', marginTop: 30, alignItems: 'center' },
  zonesList: { width: '85%', marginTop: 15 },
  zoneItem: {
    backgroundColor: '#F3E5F5',
    borderRadius: 10,
    paddingVertical: 15,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 2
  },
  zoneText: { fontSize: 14, color: '#6A1B9A', fontWeight: 'bold' }
})
