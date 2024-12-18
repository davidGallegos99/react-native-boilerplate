import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import ReactNativeModal from "react-native-modal"
import pC from '../theme/colores'

interface ModalSalirProps {
modalSalirVisible: boolean;
controllerSalir: () => void;
controllerNoSalir: () => void;
}

const ModalSalir: React.FC<ModalSalirProps> = ({ modalSalirVisible, controllerSalir, controllerNoSalir }) => {
    const iconoModalSalir = require("../icons/salirIcono.jpg")
    return (
        <ReactNativeModal
            backdropOpacity={modalSalirVisible ? 0.5 : 0}
            isVisible={modalSalirVisible}
            animationIn={'fadeIn'}
            animationOut={'fadeOut'}
            style={estiloModalSalir.modalContenedor}
            >
            <View style={estiloModalSalir.modalContenido}>
                <Image source={iconoModalSalir} style={estiloModalSalir.logoModal} resizeMode='cover'></Image>
                <Text style={estiloModalSalir.titulo}>¿Confirma volver al menú principal?</Text>
                <Text style={estiloModalSalir.encabezado}>¡Si sigue, perderá todo su progreso!</Text>
                <View style={estiloModalSalir.contenedorBotones}>
                    <TouchableOpacity style={estiloModalSalir.botonModal} onPress={controllerSalir}>
                        <Text style={estiloModalSalir.botonModalTexto}>Confirmar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={estiloModalSalir.botonModal} onPress={controllerNoSalir}>
                        <Text style={estiloModalSalir.botonModalTexto}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ReactNativeModal>
    )
}

const estiloModalSalir = StyleSheet.create({   
    logoModal: {
        width: 200,
        height: 200,
        borderRadius: 100,
        position: 'absolute',
        bottom: '105%',
        alignSelf: 'center'
      },
      modalContenedor: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        position: 'relative',
        backgroundColor: 'transparent'
      },
      modalContenido: {
        backgroundColor: pC.primario.claro,
        justifyContent: 'space-between',
        flexDirection: 'column',
        alignContent: 'center',
        alignSelf: 'center',
        width: '90%',
        borderRadius: 20,
        marginTop: '25%',
        paddingTop:50,
        padding: 10,
        borderColor: pC.secundario.DEFAULT + pC.transparencia[50],
        borderWidth: 2
      },
      titulo: {
        color: pC.blanco,
        margin: 15,
        marginBottom: 20,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '600'
      },
      encabezado: {
        color: pC.blanco,
        margin: 15,
        textAlign: 'center',
        fontSize: 15,
      },
      contenedorBotones:{
        justifyContent:"space-evenly",
        alignItems:"center",
        flexDirection:"row"
      },
      botonModal: {
        alignSelf: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: pC.secundario.claro,
        width: '40%',
        paddingVertical: 15,
        margin: 5,
        marginBottom: 15,
        borderRadius: 10
      },
      botonModalTexto: {
        color: pC.blanco,
        textAlign: 'center',
        fontWeight: 'bold'
      },
})

export {ModalSalir}