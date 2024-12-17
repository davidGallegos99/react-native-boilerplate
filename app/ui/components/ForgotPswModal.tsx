import React, { useEffect, useState } from 'react'
import { Dimensions, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

interface PasswordResetModalProps {
  isVisible: boolean
  onClose: () => void
  onSubmitEmail: (email: string) => void
  onSubmitCode: (code: string) => Promise<boolean>
  onSubmitNewPassword: (password: string) => void
}

const PasswordResetModal: React.FC<PasswordResetModalProps> = ({
  isVisible,
  onClose,
  onSubmitEmail,
  onSubmitCode,
  onSubmitNewPassword
}) => {
  const [step, setStep] = useState<number>(1)
  const [email, setEmail] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [errorMsj, setErrorMsj] = useState<string>('')
  const [code, setCode] = useState<string>('')
  const [newPassword, setNewPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')

  useEffect(() => {
    if (isVisible) {
      setStep(1)
      setNewPassword('')
      setEmail('')
      setConfirmPassword('')
      setCode('')
      setErrorMsj('')
    }
  }, [isVisible])

  const validateEmailFormat = (text: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(text)
  }

  const handleNextStep = async () => {
    if (step === 1) {
      if (!email.trim() || !validateEmailFormat(email)) {
        setErrorMsj('Por favor, ingresa un correo electrónico válido.')
        return
      }
      setErrorMsj('')
      onSubmitEmail(email)
      setStep(2)
    } else if (step === 2) {
      if (!code.trim()) {
        setErrorMsj('Por favor, ingresa el código enviado a tu correo.')
        return
      }
      setErrorMsj('')
      const isCodeValid = await onSubmitCode(code)
      if (!isCodeValid) {
        setErrorMsj('El código ingresado es inválido. Por favor, inténtalo de nuevo.')
        return
      }
      setStep(3)
    } else if (step === 3) {
      if (!newPassword || newPassword.length < 8) {
        setErrorMsj('La contraseña debe tener al menos 8 caracteres.')
        return
      }
      if (newPassword !== confirmPassword) {
        setErrorMsj('Las contraseñas no coinciden.')
        return
      }
      setErrorMsj('')
      onSubmitNewPassword(newPassword)
      onClose()
    }
  }

  const renderStepContent = () => {
    if (step === 1) {
      return (
        <>
          <Text style={styles.title}>Restaurar contraseña</Text>
          <Text style={styles.subtitle}>Ingresa tu correo electrónico</Text>
          <TextInput
            style={styles.textField}
            placeholder='Correo electrónico'
            value={email}
            onChangeText={setEmail}
            placeholderTextColor='#533A8E'
            keyboardType='email-address'
            autoCapitalize='none'
          />
        </>
      )
    }
    if (step === 2) {
      return (
        <>
          <Text style={styles.title}>Hemos enviado un código</Text>
          <Text style={styles.subtitle}>a tu correo electrónico</Text>
          <TextInput
            style={styles.textField}
            placeholder='Código'
            value={code}
            onChangeText={setCode}
            placeholderTextColor='#9D47B2'
          />
        </>
      )
    }
    if (step === 3) {
      return (
        <>
          <Text style={styles.title}>Código válido</Text>
          <Text style={styles.subtitle}>Ingrese su nueva contraseña</Text>
          <TextInput
            style={styles.textField}
            placeholder='Nueva contraseña'
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
            placeholderTextColor='#9D47B2'
          />
          <TextInput
            style={styles.textField}
            placeholder='Confirmar contraseña'
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholderTextColor='#9D47B2'
          />
        </>
      )
    }
  }

  return (
    <Modal animationType='slide' transparent={true} visible={isVisible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {renderStepContent()}
          {errorMsj && <Text style={styles.errorText}>{errorMsj}</Text>}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.button} onPress={handleNextStep}>
              <Text style={styles.buttonText}>{step < 3 ? 'Continuar' : 'Cambiar contraseña'}</Text>
            </TouchableOpacity>
          </View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.3)'
  },
  modalContainer: {
    width: width * 0.9,
    backgroundColor: '#FFF0F6',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#9D47B2',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 14,
    color: '#9D47B2',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 20
  },
  textField: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFF',
    marginBottom: 15,
    paddingHorizontal: 15,
    color: '#533A8E'
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20
  },
  button: {
    backgroundColor: '#4B376C',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 50,
    width: '70%',
    alignItems: 'center'
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16
  },
  errorText: {
    color: 'red',
    marginTop: 10
  }
})

export default PasswordResetModal
