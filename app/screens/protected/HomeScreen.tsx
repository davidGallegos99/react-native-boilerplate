/* eslint-disable react-native/no-inline-styles */
import { useEffect, useState } from 'react'
import { Dimensions, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import Logo from '../../../logo.svg'
import Loader from '../../ui/components/Loader'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Emotion } from 'interfaces/Emotion.interface'
import { Gallery, GalleryImage } from 'interfaces/GetGallery'
import { NewsItem } from 'interfaces/News'

import Carousel from '@ui/components/Carousel'
import GalleryModal from '@ui/components/GalleryModal'
import NewsModal from '@ui/components/NewsModal'
import { SliderCard, SliderVideoCard } from '@ui/components/SliderCard'

import { storeData } from '@services/AsyncStorage.service'
import { GetEmotions } from '@services/GetEmotions.service'
import { TiktokItem, getTikTokVideos } from '@services/Tiktok.service'
import { Video } from '@services/Videos.service'
import { CarrouselImg, GetCarrouselImages, GetNews } from '@services/home/GetCrrouselmages.service'
import { GetImagesHome } from '@services/home/GetHomeImages.service'
import { createDailyEmotion } from '@services/setDailyEmotion'

import api from '@config/axiosConfig'

import img1 from '@assets/images/1.png'
import img2 from '@assets/images/2.png'

import ModalComponent from './Modal'

const { width, height } = Dimensions.get('window')
export function HomeScreen() {
  const renderVideoItem = (item: TiktokItem) => <SliderVideoCard item={item} />
  const [loading, setLoading] = useState<boolean>(true)
  const [imgsHome, setimgsHome] = useState<Gallery[]>([])
  const [emotions, setEmotions] = useState<Emotion[]>([])
  const [newsData, setNewsData] = useState<NewsItem[]>([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [videos, setvideos] = useState<TiktokItem[]>([])
  const [isImageModalVisible, setIsImageModalVisible] = useState(false)
  const [showModalNews, setShowModalNews] = useState(false)
  const [infNews, setInfNews] = useState<{
    title: string
    body: string
    cover_image_url: string
  } | null>(null)

  const [selectedImage, setSelectedImage] = useState<GalleryImage[]>([])

  const handleEmotionSelect = async (emotion: string) => {
    try {
      const response = await createDailyEmotion({ emotion })
      return {
        tip_title: response.data.tip_title,
        tip_description: response.data.tip_description
      }
    } catch (error) {
      console.error('Error sending emotion:', error)
      return null
    }
  }
  const selectNew = (title: string, body: string, cover_image_url: string) => {
    setShowModalNews(true)
    setInfNews({ title, body, cover_image_url })
  }
  const checkModalVisibility = async () => {
    try {
      const lastShownDate = await AsyncStorage.getItem('lastModalDate')
      const today = new Date().toISOString().split('T')[0]
      if (lastShownDate !== today) {
        setIsModalVisible(true)
        await storeData('lastModalDate', today)
      }
    } catch (error) {
      console.error('Error checking modal visibility:', error)
    }
  }

  const getVideos = async () => {
    const res = await getTikTokVideos()
    setvideos(res.data)
  }

  const getHomeImage = async () => {
    try {
      const imgs = await GetImagesHome()
      const news = await GetNews()
      setimgsHome(imgs.data)
      setNewsData(news.data)
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  const handleImagePress = (gallery_images: GalleryImage[]) => {
    setSelectedImage(gallery_images)
    setIsImageModalVisible(true)
  }

  const fetchEmotions = async () => {
    const res = await GetEmotions()
    setEmotions(res.data)
  }

  useEffect(() => {
    getHomeImage()
    fetchEmotions()
    getVideos()
    checkModalVisibility()
  }, [])

  if (loading) {
    return <Loader loading />
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {isModalVisible && (
        <ModalComponent
          emotions={emotions}
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onEmotionSelect={handleEmotionSelect}
        />
      )}
      <View style={styles.item}>
        <Logo width={125} height={125} />
        <FlatList
          style={{ marginBottom: 30 }}
          data={imgsHome}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleImagePress(item.gallery_images)}>
              <SliderCard item={item} />
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />

        <Text style={{ color: '#FF00A6', fontSize: 20, marginBottom: 10 }}>Noticias de la semana</Text>
        <Carousel data={newsData} onImagePress={data => selectNew(data.title, data.body, data.cover_image_url)} />
        <FlatList
          style={{ marginTop: 30, marginBottom: 150 }}
          data={videos}
          renderItem={({ item }) => renderVideoItem(item)}
          keyExtractor={item => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      </View>
      <GalleryModal images={selectedImage} isOpen={isImageModalVisible} onClose={() => setIsImageModalVisible(false)} />
      <NewsModal
        news={infNews || { title: '', body: '', cover_image_url: '' }}
        isOpen={showModalNews}
        onClose={() => setShowModalNews(false)}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#fff'
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },
  logo: {
    resizeMode: 'contain',
    marginTop: 20
  },

  listContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
    flexDirection: 'row',
    height: 155,
    gap: 30
  },

  icon: {
    width: 100,
    height: 100,
    resizeMode: 'contain'
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  centralImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain'
  },
  stopText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#AA5EC9'
  },
  violenceText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#AA5EC9'
  }
})
