import React from 'react'
import { Dimensions, Image, Modal, StyleSheet, TouchableOpacity, View } from 'react-native'

const { width, height } = Dimensions.get('window')

type ImageModalProps = {
  isVisible: boolean
  onClose: () => void
  image: string | null
}

const ImageModal: React.FC<ImageModalProps> = ({ isVisible, onClose, image }) => {
  return (
    <Modal animationType='fade' transparent={true} visible={isVisible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <TouchableOpacity style={styles.modalBackground} onPress={onClose}>
          {image && <Image source={{ uri: image }} style={styles.modalImage} />}
        </TouchableOpacity>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)'
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalImage: {
    width: width * 0.9,
    height: height * 0.7,
    resizeMode: 'contain',
    borderRadius: 10
  }
})

export default ImageModal
