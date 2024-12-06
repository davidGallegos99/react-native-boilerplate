import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import MapsIcon from '../../assets/icons/maps.svg'
import WazeIcon from '../../assets/icons/waze.svg'

import { Directory } from '@services/directories/GetDirectoriesByZone.service'

function SpecialistCard({ item }: { item: Directory }) {
  return (
    <View style={styles.card}>
      <View style={styles.textContainer1}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.phone}>{item.phone}</Text>
      </View>
      <View style={styles.textContainer2}>
        <Text style={styles.address}>{item.address}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#9D47B2',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%'
  },
  contactInformation: {
    flexDirection: 'row',
    gap: 5,
    position: 'absolute',
    bottom: 20,
    left: 20
  },
  textContainer1: {
    display: 'flex',
    width: '50%',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    alignSelf: 'flex-start'
  },
  textContainer2: {
    display: 'flex',
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF'
  },
  phone: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '700',
    marginVertical: 5
  },
  address: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 20,
    fontWeight: '400'
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 100
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 10
  }
})

export default SpecialistCard
