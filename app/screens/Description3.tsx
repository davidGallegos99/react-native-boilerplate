import React, { useEffect, useState } from 'react'
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { StackNavigationProp } from '@react-navigation/stack'
import { Sponsor } from 'interfaces/Sponso.interface'
import Icon from 'react-native-vector-icons/Ionicons'

import Patreon from '@ui/components/Patreon'

import { GetPatreons } from '@services/Patreon.service'

import colors from '@config/theme/colors'

import { LayoutUtils } from '@utils/layout'

import { RootStackParamList } from './SignUpOptsScreen'

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Description3'>
interface Props {
  navigation: RegisterScreenNavigationProp
}

const { height, width } = Dimensions.get('window')

const Description3Screen = ({ navigation }: Props) => {
  const [patreons, setPatreons] = useState<Sponsor[]>([])

  const getPatreons = async () => {
    const res = await GetPatreons()
    setPatreons(res.data)
  }

  useEffect(() => {
    getPatreons()
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>CON EL APOYO DE</Text>
      <FlatList
        data={patreons}
        renderItem={({ item }) => <Patreon url={item.sponsor_image} />}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
      <TouchableOpacity style={styles.floatingButton} onPress={() => navigation.navigate('Main')}>
        <Icon name='arrow-forward' size={24} color='#fff' />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: LayoutUtils.moderateScale(20),
    minHeight: height,
    width: '100%'
  },
  row: {
    gap: 20,
    justifyContent: 'space-around',
    marginVertical: 10
  },
  welcomeText: {
    fontSize: LayoutUtils.moderateScale(35),
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.secondaryTextColor,
    marginBottom: LayoutUtils.moderateScale(20)
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    backgroundColor: colors.primary,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5
  }
})

export default Description3Screen
