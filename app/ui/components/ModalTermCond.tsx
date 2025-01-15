import React from 'react'
import { Dimensions, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import colors from '@config/theme/colors'

const { width, height } = Dimensions.get('window')

type ModalTermCondProps = {
  modalVisible: boolean
  onClose: () => void
  title: string
  content: string | React.ReactNode
  acceptButtonText?: string
  onAccept: () => void
}

const ModalTermCond: React.FC<ModalTermCondProps> = ({
  modalVisible,
  onClose,
  title,
  content,
  acceptButtonText = 'ACEPTO',
  onAccept
}) => {
  return (
    <Modal animationType='slide' transparent={true} visible={modalVisible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.modalTitle}>{title}</Text>
            {typeof content === 'string' ? <Text style={styles.modalText}>{content}</Text> : content}
          </ScrollView>
          <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
            <Text style={styles.acceptButtonText}>{acceptButtonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    width: width * 0.9,
    height: height * 0.8,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    justifyContent: 'space-between'
  },
  scrollContent: {
    paddingBottom: 20
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333'
  },
  modalText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
    textAlign: 'justify'
  },
  acceptButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 20
  },
  acceptButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  }
})

export default ModalTermCond
