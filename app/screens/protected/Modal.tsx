import React, { useState } from 'react'
import { Dimensions, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface TipData {
  tip_title: string
  tip_description: string
}

interface ModalProps {
  isVisible: boolean
  onClose: () => void
  emotions: { id: number; emotion: string; icon: any }[]
  onEmotionSelect: (emotion: string) => Promise<TipData | null>
}

const ModalComponent: React.FC<ModalProps> = ({ isVisible, onClose, emotions, onEmotionSelect }) => {
  const [view, setView] = useState<'emotions' | 'tip'>('emotions')
  const [tipData, setTipData] = useState<TipData | null>(null)

  const handleEmotionSelect = async (emotion: string) => {
    const tip = await onEmotionSelect(emotion)
    if (tip) {
      setTipData(tip)
      setView('tip')
    }
  }

  return (
    <Modal animationType='fade' transparent={true} visible={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {view === 'emotions' && (
            <>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>
              <Text style={styles.title}>¿CÓMO TE SIENTES AHORA?</Text>
              <ScrollView contentContainerStyle={styles.emotionContainer}>
                {emotions.map(emotion => (
                  <TouchableOpacity
                    key={emotion.id}
                    style={styles.circle}
                    onPress={() => handleEmotionSelect(emotion.emotion)}
                  >
                    <Image source={emotion.icon} style={styles.icon} />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          )}
          {view === 'tip' && tipData && (
            <>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>
              <Text style={styles.title}>{tipData.tip_title}</Text>
              <Text style={styles.description}>{tipData.tip_description}</Text>
            </>
          )}
        </View>
      </View>
    </Modal>
  )
}

const { width } = Dimensions.get('window')

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    width: width * 0.8,
    backgroundColor: '#FDE8F3',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center'
  },
  closeButton: {
    alignSelf: 'flex-end',
    // padding: -20
    marginRight: -10,
    marginTop: -10,
    marginBottom: 20
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#A74AB5'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A154B',
    marginBottom: 20,
    textAlign: 'center',
    marginTop: -35
  },
  emotionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingBottom: 10
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },
  icon: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  description: {
    fontSize: 14,
    color: '#4A154B',
    textAlign: 'center',
    marginTop: 10
  }
})

export default ModalComponent
