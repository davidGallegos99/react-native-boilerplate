/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react'
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { Interest } from 'interfaces/GetInterests.interface'

import Button from '@ui/components/Button'

import { GetInterests } from '@services/GetInterests.service'

import colors from '@config/theme/colors'

const { height: screenHeight } = Dimensions.get('window')

interface Props {
  onSubmit: Function
}

export function ThirdStepForm({ onSubmit }: Props) {
  const [selected, setselected] = useState<number[]>([])
  const [interests, setinterests] = useState<Interest[]>([])
  const handleConfirm = () => {
    onSubmit({ interest_ids: selected })
  }

  const handleOnpress = (item: number) => {
    if (selected.includes(item)) return setselected(selected.filter(el => el !== item))
    setselected([...selected, item])
  }

  const fetchInterests = async () => {
    const res = await GetInterests()
    setinterests(res.data)
  }

  useEffect(() => {
    fetchInterests()
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.stepProgressContainer}>
        <View style={styles.step} />
        <View style={styles.activeStep} />
      </View>
      {/* Header Fijo */}
      <View style={styles.header}>
        <Text style={styles.title}>¿Qué te interesa?</Text>
        <Text style={styles.subtitle}>Puedes elegir más de 1</Text>
      </View>

      {/* Lista Scrolleable */}
      <View style={styles.preferencesContainer}>
        <FlatList
          data={interests}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleOnpress(item.id)}
              style={{ ...styles.item, backgroundColor: selected.includes(item.id) ? '#ec742ed9' : '#FF6F151F' }}
            >
              <Text style={styles.itemText}>{item.interest}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <View style={styles.buttonBox}>
        <Button handleClick={handleConfirm} appearance='filled' color={colors.primary} rounded>
          <Text style={styles.buttonText} numberOfLines={1} adjustsFontSizeToFit>
            CONFIRMAR
          </Text>
        </Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  preferencesContainer: {
    height: screenHeight * 0.55
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 60
  },
  header: {
    marginTop: 50,
    marginBottom: 20,
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.secondary
  },
  buttonBox: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    flex: 1,
    paddingBottom: 30
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    paddingHorizontal: 10
  },
  subtitle: {
    fontSize: 16,
    color: colors.primaryTextColor,
    marginTop: 5
  },
  listContainer: {
    paddingBottom: 20
  },
  item: {
    backgroundColor: '#FF6F151F',
    paddingVertical: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15
  },
  itemText: {
    fontSize: 18,
    color: colors.primaryTextColor,
    fontWeight: '500'
  },
  stepProgressContainer: {
    flexDirection: 'row',
    gap: 29,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25
  },
  activeStep: {
    width: 33,
    height: 33,
    borderRadius: 50,
    backgroundColor: colors.stepColor
  },
  step: {
    width: 16,
    height: 16,
    borderRadius: 50,
    backgroundColor: colors.stepColor
  }
})
