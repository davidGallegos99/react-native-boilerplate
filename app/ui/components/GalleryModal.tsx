import React, { useState } from 'react'
import { ActivityIndicator, FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { GalleryImage } from 'interfaces/GetGallery'

import ImgZoom from './ImgZoom'

interface GalleryModalProps {
  images: GalleryImage[]
  isOpen: boolean
  onClose: () => void
}

const GalleryModal: React.FC<GalleryModalProps> = ({ images = [], isOpen, onClose }) => {
  const [isImageModalVisible, setIsImageModalVisible] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const handleImagePress = (imgUrl: string) => {
    setSelectedImage(imgUrl)
    setIsImageModalVisible(true)
  }
  return (
    <>
      <Modal visible={isOpen} transparent animationType='slide'>
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✖</Text>
            </TouchableOpacity>
            <FlatList
              data={images}
              keyExtractor={item => item?.id?.toString()}
              numColumns={2}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleImagePress(item.image_url)}>
                  <GalleryImageItem imageUrl={item.image_url} />
                </TouchableOpacity>
              )}
              columnWrapperStyle={styles.row}
            />
          </View>
        </View>
      </Modal>
      <ImgZoom
        isOpen={isImageModalVisible}
        imageUrl={selectedImage ? selectedImage : ''}
        onClose={() => setIsImageModalVisible(false)}
      />
    </>
  )
}

const GalleryImageItem: React.FC<{ imageUrl: string }> = ({ imageUrl }) => {
  const [loading, setLoading] = useState(true)

  return (
    <View style={styles.imageContainer}>
      {loading && <ActivityIndicator size='small' color='purple' style={styles.loader} />}
      <Image source={{ uri: imageUrl }} style={styles.image} resizeMode='contain' onLoadEnd={() => setLoading(false)} />
    </View>
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
    backgroundColor: '#FCE4EC',
    padding: 20,
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
    alignItems: 'center'
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 10
  },
  closeText: {
    fontSize: 24,
    color: 'purple'
  },
  row: {
    gap: 20,
    justifyContent: 'space-around',
    marginVertical: 10,
    marginBottom: -15
  },
  imageContainer: {
    width: 150,
    height: 150,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FCE4EC'
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10
  },
  loader: {
    position: 'absolute'
  },
  modalImage: {
    width: 300,
    height: 400,
    resizeMode: 'contain',
    borderRadius: 10
  }
})

export default GalleryModal
