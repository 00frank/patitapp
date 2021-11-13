import iconSet from '@expo/vector-icons/build/Fontisto'
import React from 'react'
import { TouchableOpacity, Font,Linking, Text, StyleSheet, Image } from 'react-native'


export default function WhatsappButton() {
    const openWhatsapp = () => {
        Linking.openURL('whatsapp://send?phone=+5491155130671') 
        
    }
    return (
      <TouchableOpacity onPress={openWhatsapp}>
         <Text style={styles.buttonText}>
        <Image source={{ uri: "https://img.icons8.com/color/48/000000/whatsapp--v1.png" }} style={styles.whatsappLogo} />
        Comunicarse al Whatsapp
      </Text>
    </TouchableOpacity>
           
    )
}
const styles = StyleSheet.create({
    button: {
      backgroundColor: "#FFFFFF",
      padding: 15,
      paddingTop: 0,
      borderWidth: 2,
      borderColor: "#000000",
      borderRadius: 10,
      height: 50
    },
    buttonText: {
      color: "white",
      fontSize: 14,
      fontWeight: '700',
      minHeight: 50,
    },
    whatsappLogo: {
      width: 30,
      height: 30,
    }
  })