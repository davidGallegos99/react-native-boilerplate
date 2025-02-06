import React, { useState } from 'react'
import { ActivityIndicator, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface GalleryModalProps {
  imageUrl: string
  isOpen: boolean
  onClose: () => void
}

const ImgZoom: React.FC<GalleryModalProps> = ({ imageUrl, isOpen, onClose }) => {
  const [loading, setLoading] = useState(true)

  return (
    <Modal visible={isOpen} transparent animationType='slide'>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>✖</Text>
          </TouchableOpacity>
          <View style={styles.imageContainer}>
            {<ActivityIndicator size='large' color='purple' style={styles.loader} />}
            <Image
              source={{ uri: imageUrl }}
              style={styles.image}
              resizeMode='cover'
              onLoadEnd={() => setLoading(false)}
            />
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#FCE4EC',
    padding: 20,
    borderRadius: 20,
    width: '90%',
    height: '80%',
    alignItems: 'center'
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    fontSize: 24,
    color: 'purple',
    borderRadius: 20,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  closeText: {
    fontSize: 24,
    color: 'purple',
    fontWeight: 'bold'
  },
  imageContainer: {
    width: 325,
    height: 325,
    borderRadius: 155,

    justifyContent: 'center',
    alignItems: 'center'
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.3,
    // shadowRadius: 6,
    // elevation: 8
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 155
  },
  loader: {
    position: 'absolute'
  }
})

export default ImgZoom
