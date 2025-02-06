import { useState } from 'react'
import { ImageBackground, ImageSourcePropType, Linking, Pressable, StyleSheet, Text, View } from 'react-native'

import PlayImg from '../../assets/icons/play.svg'
import { Gallery } from 'interfaces/GetGallery'

import { TiktokItem } from '@services/Tiktok.service'

export function SliderCard({ item }: { item: Gallery }) {
  const resolveSource = (): ImageSourcePropType => {
    if (typeof item.cover_image_url === 'string') {
      return { uri: item.cover_image_url }
    } else {
      return item.cover_image_url
    }
  }

  return (
    <View style={styles.box}>
      <ImageBackground source={resolveSource()} style={styles.image}>
        <View style={styles.overlay}>
          <Text style={styles.overlayText}>{item.title}</Text>
        </View>
      </ImageBackground>
    </View>
  )
}

export function SliderVideoCard({ item }: { item: TiktokItem }) {
  return (
    <View style={styles.listItem}>
      <View style={styles.videoContainer}>
        <Pressable
          onPress={() => {
            Linking.openURL(item.link).catch(err => console.error('Error al abrir el enlace:', err))
          }}
        >
          <View style={{ position: 'relative' }}>
            <ImageBackground
              style={styles.imageContainer}
              source={{
                uri: item.cover_image_url
              }}
              resizeMode='cover'
            />
            <PlayImg style={styles.imagePlay} />
          </View>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  box: {
    width: 144,
    height: 148,
    overflow: 'hidden',
    backgroundColor: 'white',
    borderRadius: 25,
    elevation: 4
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center'
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#9D47B2',
    opacity: 0.8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  overlayText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  listItem: {
    marginBottom: 20,
    alignItems: 'center'
  },
  imageContainer: {
    width: 140,
    height: 140,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginRight: 20,
    opacity: 0.8,
    objectFit: 'cover'
  },
  videoContainer: {
    flex: 1,
    alignItems: 'center'
  },
  imagePlay: {
    width: 60,
    height: 60,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -30 }, { translateY: -30 }]
  }
})
