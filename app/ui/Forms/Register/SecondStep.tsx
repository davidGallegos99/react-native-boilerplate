/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import Logo from '../../../../logo.svg'
import TextField from '../TextField'
import { Picker } from '@react-native-picker/picker'
import { Formik } from 'formik'
import { IDeparment } from 'interfaces/GetDeparments.interface'
import { IGender } from 'interfaces/GetGenders.interface'
import { ScrollView } from 'react-native-gesture-handler'
import * as Yup from 'yup'

import Button from '@ui/components/Button'
import Title from '@ui/tipografy/Title'

import { GetDeparments } from '@services/GetDepartments.service'
import { GetGenders } from '@services/GetGenders.service'

import colors from '@config/theme/colors'

const SignupSchema = Yup.object().shape({
  alias: Yup.string().min(4, 'Muy corto!').required('El pronombre es requerido'),
  day: Yup.number().max(31, 'Solo dias calendario validos').required('El dia es requerido'),
  month: Yup.number().min(1).max(12).required('El mes es requerido'),
  year: Yup.number()
    .min(1950, 'Año no puede ser menor 1950')
    .max(new Date().getFullYear(), `El año no debe ser mayor a ${new Date().getFullYear()}`)
    .required('El año es requerido'),
  gender_id: Yup.string().required('Genero es requerido'),
  department_id: Yup.string().required('El departamento es requerido')
})

interface Props {
  onSubmit: Function
}

export function SecondStepForm({ onSubmit }: Props) {
  const [genders, setgenders] = useState<IGender[]>([])
  const [dptos, setDptos] = useState<IDeparment[]>([])

  const months = [
    { text: 'Seleccione un mes', value: null },
    { text: 'Enero', value: 1 },
    { text: 'Febrero', value: 2 },
    { text: 'Marzo', value: 3 },
    { text: 'Abril', value: 4 },
    { text: 'Mayo', value: 5 },
    { text: 'Junio', value: 6 },
    { text: 'Julio', value: 7 },
    { text: 'Agosto', value: 8 },
    { text: 'Septiembre', value: 9 },
    { text: 'Octubre', value: 10 },
    { text: 'Noviembre', value: 11 },
    { text: 'Diciembre', value: 12 }
  ]

  const getGenders = async () => {
    const res = await GetGenders()
    console.log('🚀 ~ getGenders ~ res.data:', res.data)
    setgenders(res.data)
  }
  const getDeptos = async () => {
    const res = await GetDeparments()
    setDptos(res.data)
  }

  useEffect(() => {
    getGenders()
    getDeptos()
  }, [])

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.mainContainer}>
        <View style={styles.appLogoContainer}>
          <Logo width={100} height={100} />
        </View>
        <View style={styles.stepProgressContainer}>
          <View style={styles.activeStep} />
          <View style={styles.step} />
        </View>

        <Formik
          initialValues={{ day: null, month: null, year: null, department_id: '', alias: '', gender_id: '' }}
          validationSchema={SignupSchema}
          onSubmit={values => {
            const dataToSend = {
              alias: values.alias,
              gender_id: values.gender_id,
              department_id: values.department_id,
              birth_date: `${values.month}/${values.day}/${values.year}`
            }
            onSubmit(dataToSend)
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values, setFieldValue, errors, touched }: any) => (
            <View style={styles.formContainer}>
              <Title style={{ textAlign: 'center' }}>¡Cuéntanos sobre tí!</Title>
              <Text style={styles.labelDecription}>
                Queremos conocerte y saber más de tí para brindarte una atención más personalizada.
              </Text>
              <View style={styles.controlsContainer}>
                <View style={styles.spacing}>
                  <TextField
                    label='¿Cómo te gusta que te llamen?'
                    onChangeText={handleChange('alias')}
                    onBlur={handleBlur('alias')}
                    value={values.alias}
                    placeholder='Pronombre'
                  />
                  {errors.alias && touched.alias && <Text style={styles.errorText}>{errors.alias}</Text>}
                </View>

                <Text style={styles.label}>Fecha de nacimiento</Text>
                <View style={styles.dateOfBirthContainer}>
                  <View style={styles.pickerWapper}>
                    <TextField
                      keyBoardType='number-pad'
                      onChangeText={handleChange('day')}
                      onBlur={handleBlur('day')}
                      value={values.day}
                      placeholder='Dia'
                    />
                  </View>
                  <View style={styles.pickerWapper2}>
                    <Picker
                      selectedValue={values.month}
                      style={styles.picker}
                      onValueChange={itemValue => setFieldValue('month', itemValue)}
                    >
                      {months.map(el => (
                        <Picker.Item key={el.value} label={el.text} value={el.value} />
                      ))}
                    </Picker>
                  </View>
                  <View style={styles.pickerWapper}>
                    <TextField
                      keyBoardType='number-pad'
                      onChangeText={handleChange('year')}
                      onBlur={handleBlur('year')}
                      value={values.year}
                      placeholder='Año'
                    />
                  </View>
                </View>
                {errors.day && touched.day && <Text style={styles.errorText}>{errors.day}</Text>}
                {errors.month && touched.month && <Text style={styles.errorText}>{errors.month}</Text>}
                {errors.year && touched.year && <Text style={styles.errorText}>{errors.year}</Text>}

                <View style={styles.spacing} />
                <Text style={styles.label}>¿Genero?</Text>
                <View style={{ ...styles.pickerWapper2 }}>
                  <Picker
                    selectedValue={values.gender_id}
                    style={styles.picker}
                    onValueChange={itemValue => setFieldValue('gender_id', itemValue)}
                  >
                    {genders
                      .map(e => ({ text: e.gender, value: e.id }))
                      .map(el => (
                        <Picker.Item key={el.value} label={el.text} value={el.value} />
                      ))}
                  </Picker>
                </View>
                {errors.gender_id && touched.gender_id && (
                  <Text style={{ ...styles.errorText, ...styles.spacing }}>{errors.gender_id}</Text>
                )}

                <View style={styles.spacing} />
                <Text style={styles.label}>¿De dónde eres?</Text>
                <View style={{ ...styles.pickerWapper2 }}>
                  <Picker
                    selectedValue={values.department_id}
                    style={styles.picker}
                    onValueChange={itemValue => setFieldValue('department_id', itemValue)}
                  >
                    {dptos.map(el => (
                      <Picker.Item key={el.id} label={el.department_name} value={el.id} />
                    ))}
                  </Picker>
                </View>
                {errors.department_id && touched.department_id && (
                  <Text style={{ ...styles.errorText, ...styles.spacing }}>{errors.department_id}</Text>
                )}
                <View style={styles.buttonBox}>
                  <Button appearance='filled' color={colors.primary} handleClick={handleSubmit} rounded>
                    SIGUIENTE
                  </Button>
                </View>
              </View>
            </View>
          )}
        </Formik>
      </View>
    </ScrollView>
  )
}
const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1
  },
  dateOfBirthContainer: {
    flexDirection: 'row',
    gap: 10
  },
  termsAndCondition: {
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 10,
    color: colors.secondaryTextColor,
    marginBottom: 20
  },
  pickerWapper: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#E0E0E0',
    height: 50,
    width: 'auto',
    alignSelf: 'stretch',
    flex: 1
  },
  pickerWapper2: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#E0E0E0',
    height: 50,
    width: 'auto',
    alignSelf: 'stretch',
    flex: 2
  },
  picker: {
    color: colors.primaryTextColor
  },
  loginLink: {
    fontWeight: 'bold',
    color: '#000'
  },
  labelDecription: {
    color: colors.primaryTextColor,
    fontWeight: '600',
    textAlign: 'center',
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingTop: 10,
    paddingBottom: 30
  },
  label: {
    color: colors.primaryTextColor,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
    marginTop: 5
  },
  mainContainer: {
    flex: 1,
    paddingTop: 55
  },
  stepProgressContainer: {
    flexDirection: 'row',
    gap: 29,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25
  },
  activeStep: {
    width: 33,
    height: 33,
    borderRadius: 50,
    backgroundColor: colors.stepColor
  },
  step: {
    width: 16,
    height: 16,
    borderRadius: 50,
    backgroundColor: colors.stepColor
  },
  loginText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 25
  },
  buttonBox: {
    width: '100%',
    marginTop: 50,
    marginBottom: 30
  },
  appLogoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30
  },
  formContainer: {
    flex: 4
  },
  controlsContainer: {
    marginTop: 5,
    width: '90%',
    margin: 'auto'
  },
  spacing: {
    marginBottom: 20
  },
  errorText: {
    color: 'red'
  }
})
