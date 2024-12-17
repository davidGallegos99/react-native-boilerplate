/* eslint-disable react-native/no-inline-styles */
import { ScrollView, StyleSheet, Text, View } from 'react-native'

import Logo from '../../../../logo.svg'

import Button from '@ui/components/Button'

import { LayoutUtils } from '@utils/layout'

export function DirectoryMain({ handleClick }: { handleClick: Function }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.item}>
        <Logo width={125} height={125} />
      </View>
      <View style={styles.titleContainer}>
        <Text style={{ ...styles.label, ...styles.somosLabel }}>SOMOS</Text>
        <Text style={{ ...styles.label, ...styles.tuRedLabel }}>TU RED DE</Text>
        <Text style={{ ...styles.label, ...styles.apoyoLabel }}>APOYO</Text>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.content}>
          ¡Bienvenidas/os/es  la colectiva feminista en articulación con organizaciones territoriales ponemos a
          disposición de las juventudes diversas, un directorio telefónico de Instituciones y organizaciones locales que
          poseen servicios de prevención y atención cercanos a tu residencia.
        </Text>
        <Text style={styles.content}>
          Aquí encontrarás información relevante según tu zona de residencia, para que pueden ser de  ayuda en un
          momento de emergencia y/o una situación de violencia. Explora, conecta y conoce los servicios institucionales
          de tu localidad a través de INCLUD.
        </Text>
      </View>
      <View style={{ marginBottom: 100, width: '95%' }}>
        <Button handleClick={handleClick} elevated rounded appearance='filled'>
          DIRECTORIO POR ZONAS
        </Button>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: LayoutUtils.moderateScale(20),
    paddingTop: 0
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },
  somosLabel: {
    color: '#FF6F15'
  },
  tuRedLabel: {
    color: '#9D47B2'
  },
  apoyoLabel: {
    color: '#FF6F15'
  },
  label: {
    textAlign: 'center',
    fontSize: 40,
    fontWeight: '900',
    lineHeight: 39
  },
  titleContainer: {
    marginTop: 25
  },
  contentContainer: {
    marginTop: 10,
    fontSize: 10,
    width: '80%'
  },
  content: {
    color: 'black',
    fontWeight: '300',
    fontSize: LayoutUtils.scaleFontSize(18),
    textAlign: 'justify',
    marginBottom: 35
  }
})
