/**
 * @format
 */
import { AppRegistry } from 'react-native'

import { name as appName } from './app.json'
import App from './app/App'
import TrackPlayer from 'react-native-track-player'

TrackPlayer.registerPlaybackService(() => require('./trackPlayerService'))

AppRegistry.registerComponent(appName, () => App)
