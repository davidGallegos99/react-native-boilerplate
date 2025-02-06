import React from 'react'
import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface NewsModalProps {
  isOpen: boolean
  onClose: () => void
  news: {
    title: string
    body: string
    cover_image_url: string
  }
}

const NewsModal: React.FC<NewsModalProps> = ({ isOpen, onClose, news }) => {
  return (
    <Modal visible={isOpen} transparent animationType='slide'>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✖</Text>
            </TouchableOpacity>
            <Text style={styles.title}>{news.title}</Text>
          </View>
          <Image source={{ uri: news.cover_image_url }} style={styles.image} resizeMode='cover' />
          <ScrollView style={styles.bodyContainer}>
            <Text style={styles.body}>{news.body}</Text>
          </ScrollView>
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
    backgroundColor: '#E1A6D3',
    padding: 15,
    borderRadius: 20,
    width: '90%',
    maxHeight: '85%',
    alignItems: 'center'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingBottom: 10
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 5,
    // backgroundColor: '#C27BA0',
    borderRadius: 20,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  closeText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
  title: {
    marginRight: '10%',
    // marginLeft: '10%',
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    flex: 1
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 15
  },
  bodyContainer: {
    marginTop: 10,
    padding: 10,
    // backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 15,
    maxHeight: 300
  },
  body: {
    fontSize: 14,
    textAlign: 'justify',
    color: 'white'
  }
})

export default NewsModal
