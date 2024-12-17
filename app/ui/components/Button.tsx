import React from 'react'
import { StyleSheet, Text } from 'react-native'

import { TouchableOpacity } from 'react-native-gesture-handler'

import colors from '@config/theme/colors'

import { LayoutUtils } from '@utils/layout'

interface Props {
  children: React.ReactNode
  color?: string
  rounded?: boolean
  handleClick?: any
  appearance: 'filled' | 'outlined'
  icon?: React.ReactNode
  elevated?: boolean
  customRadius?: number
  disabled?: boolean
}

const DISABLED_BACKGROUND = '#E0E0E0'
const DISABLED_TEXT = '#A0A0A0'
const DISABLED_BORDER = '#C0C0C0'

function Button({ children, color, rounded, customRadius, elevated, handleClick, appearance, icon, disabled }: Props) {
  const styles = StyleSheet.create({
    registerButton: {
      width: '100%',
      padding: LayoutUtils.moderateScale(15),
      backgroundColor: disabled ? DISABLED_BACKGROUND : color ?? colors.secondary,
      borderRadius: rounded ? 50 : customRadius ? customRadius : 10,
      justifyContent: 'center',
      alignItems: 'center'
    },
    buttonText: {
      color: disabled ? DISABLED_TEXT : '#fff',
      fontSize: LayoutUtils.scaleFontSize(16)
    },
    googleButton: {
      width: '100%',
      padding: LayoutUtils.moderateScale(15),
      flexDirection: 'row',
      gap: 15,
      borderColor: disabled ? DISABLED_BORDER : color ?? colors.primary,
      borderWidth: 1,
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: LayoutUtils.moderateScale(20)
    },
    googleButtonText: {
      color: disabled ? DISABLED_TEXT : color ?? colors.primary,
      fontSize: LayoutUtils.scaleFontSize(16)
    },
    elevation: {
      elevation: 10
    }
  })

  return (
    <TouchableOpacity
      role='button'
      onPress={disabled ? undefined : handleClick}
      style={{
        ...(appearance === 'filled' ? styles.registerButton : styles.googleButton),
        ...(elevated && !disabled ? { elevation: 10 } : {})
      }}
      activeOpacity={disabled ? 1 : 0.7}
    >
      {icon ?? null}
      <Text style={appearance === 'filled' ? styles.buttonText : styles.googleButtonText}>{children}</Text>
    </TouchableOpacity>
  )
}

export default Button
