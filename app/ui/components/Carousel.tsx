import React, { useRef, useState } from 'react'
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import Arrow from '../../assets/icons/arrow.svg'
import { NewsItem } from 'interfaces/News'

const { width } = Dimensions.get('window')

const Carousel = ({ data, onImagePress }: { data: NewsItem[]; onImagePress: (image: NewsItem) => void }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const flatListRef: any = useRef(null)

  const handleNext = () => {
    if (currentIndex < data.length - 1) {
      setCurrentIndex(currentIndex + 1)
      flatListRef?.current.scrollToIndex({ index: currentIndex + 1, animated: true })
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      flatListRef.current.scrollToIndex({ index: currentIndex - 1, animated: true })
    }
  }

  const renderItem = ({ item }: { item: NewsItem }) => (
    <TouchableOpacity style={styles.item} onPress={() => onImagePress(item)}>
      <Image source={{ uri: item.cover_image_url }} style={styles.image} />
      <View style={styles.overlay}>
        <Text style={styles.text}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        scrollEnabled={false}
        pagingEnabled
        style={styles.carousel}
        onScrollToIndexFailed={info => {
          const wait = new Promise(resolve => setTimeout(resolve, 500))
          wait.then(() => {
            flatListRef.current?.scrollToIndex({ index: info.index, animated: true })
          })
        }}
      />
      <TouchableOpacity onPress={handlePrev} style={{ ...styles.arrow, ...styles.arrowLeft }}>
        <Arrow style={{ transform: [{ rotate: '180deg' }] }} width={12} height={12} />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleNext} style={{ ...styles.arrow, ...styles.arrowRight }}>
        <Arrow width={12} height={12} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    height: 200,
    alignItems: 'center',
    justifyContent: 'center'
  },
  carousel: {
    width: width,
    height: 200
  },
  item: {
    width: width,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderRadius: 20,
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 20
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(157, 71, 178, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20
  },
  text: {
    marginRight: '10%',
    marginLeft: '10%',
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 10
  },
  arrow: {
    backgroundColor: '#FF6200',
    borderRadius: 50,
    width: 40,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 10,
    top: '50%',
    transform: [{ translateY: -20 }]
  },
  arrowLeft: {
    left: 15
  },
  arrowRight: {
    right: 15
  }
})

export default Carousel
