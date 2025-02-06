import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { StackNavigationProp } from '@react-navigation/stack'
import { Sponsor } from 'interfaces/Sponso.interface'
import { FlatList } from 'react-native-gesture-handler'

import Patreon from '@ui/components/Patreon'

import { GetPatreons } from '@services/Patreon.service'

import colors from '@config/theme/colors'

import { LayoutUtils } from '@utils/layout'

import { RootStackParamList } from './SignUpOptsScreen'

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Description3'>
interface Props {
  navigation: RegisterScreenNavigationProp
}
const Description3Screen = ({ navigation }: Props) => {
  const [patreons, setpatreons] = useState<Sponsor[]>([])

  const getPaterons = async () => {
    const res = await GetPatreons()
    setpatreons(res.data)
    setTimeout(() => {
      navigation.navigate('Main')
    }, 5000)
  }

  useEffect(() => {
    getPaterons()
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>CON EL APOYO DE</Text>
      <FlatList
        data={patreons}
        renderItem={({ item }) => <Patreon url={item.sponsor_image} />}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2} // Two columns to achieve the layout
        columnWrapperStyle={styles.row}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: LayoutUtils.moderateScale(20)
  },
  row: {
    gap: 20,
    justifyContent: 'space-around',
    marginVertical: 10
  },

  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30
  },
  logoPlaceholder: {
    width: 200,
    height: LayoutUtils.moderateVerticalScale(200),
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20
  },
  logoText: {
    color: '#000',
    fontSize: 18
  },
  welcomeText: {
    fontSize: LayoutUtils.moderateScale(35),
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.secondaryTextColor,
    marginBottom: LayoutUtils.moderateScale(20)
  },
  loadingText: {
    fontSize: LayoutUtils.scaleFontSize(16),
    color: colors.primaryTextColor,
    textAlign: 'center'
  }
})

export default Description3Screen
