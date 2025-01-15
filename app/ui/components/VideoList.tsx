import React, { useEffect, useState } from 'react'
import { Alert, Dimensions, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native'

import PlayImg from '../../assets/icons/play.svg'

import { GetVideos, Video } from '@services/Videos.service'

import CustomModal from './CustomModal'
import VideoPlayer from './VideoPlayer'

const { width: screenWidth } = Dimensions.get('window') // Obtener el ancho de la pantalla

interface VideoListProps {
  videos: Video[] // Define los videos como prop
}

function ListItem({ item, index }: { item: Video; index: number }) {
  const [showVideo, setshowVideo] = useState(false)

  return (
    <>
      <View style={styles.listItem}>
        <View style={styles.videoContainer}>
          <Pressable
            onPress={() => {
              setshowVideo(true)
            }}
          >
            <View style={{ position: 'relative' }}>
              <ImageBackground
                style={[styles.imageContainer, { width: screenWidth * 0.7 }]}
                source={{
                  uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5G0GEO6mDxg8Vk3Eg-izH67_GVj1oFMKjtA&s'
                }}
                resizeMode='cover'
              />
              <PlayImg style={styles.imagePlay} />
            </View>
          </Pressable>
        </View>
      </View>
      <CustomModal onClose={() => setshowVideo(false)} visible={showVideo}>
        <VideoPlayer video={item} />
      </CustomModal>
    </>
  )
}

function VideoList({ videos }: VideoListProps) {
  return (
    <View style={styles.container}>
      {videos.map((video, i) => (
        <ListItem key={video.id} index={i} item={video} />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingHorizontal: 20,
    marginTop: 20,
    width: '100%',
    marginBottom: 100
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center'
  },
  imageContainer: {
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

export default VideoList
