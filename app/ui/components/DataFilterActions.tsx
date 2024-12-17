/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, View } from 'react-native'

import { LayoutUtils } from '@utils/layout'

import FilterInputText from './FilterInputText'
import Menu from './Menu'

function DataFilterActions() {
  const handleChange = () => {}
  const items = [
    { title: 'item 1', value: 'item 1' },
    { title: 'item 2', value: 'item 2' },
    { title: 'item 3', value: 'item 3' },
    { title: 'item 4', value: 'item 4' }
  ]

  return (
    <View style={styles.container}>
      <View style={styles.input}>
        <FilterInputText handleChange={handleChange} placeholder='' />
      </View>
      <View style={styles.filterDrp}>
        <Menu items={items} label='ORDENAR POR' selectItemEvent={() => {}} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%'
  },
  filterDrp: {
    width: '30%',
    marginTop: 10,
    marginRight: LayoutUtils.moderateScale(20)
  },
  input: {
    marginLeft: LayoutUtils.moderateScale(20),
    width: '30%'
  }
})

export default DataFilterActions
