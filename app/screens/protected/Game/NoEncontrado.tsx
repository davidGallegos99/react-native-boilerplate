import { Text, View } from 'react-native'

const NoEncontrado = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ textAlign: 'center', margin: 50}}>
        Ha ocurrido un error y el juego no ha sido encontrado o no se ha podido cargar
      </Text>
    </View>
  )
}

export default NoEncontrado