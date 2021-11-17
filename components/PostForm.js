import React, { useState, useEffect, useContext } from 'react';
import { Image, Text, StyleSheet, TextInput, Button, ScrollView, View, TouchableHighlight } from 'react-native';
import { validatePostContactName, validatePostContactNumber, validatePostTitle, validatePostArea } from '../utils/validations';
import { createPost } from '../database';
import { DataContext } from '../contexts/GlobalContext';
import Toast from 'react-native-toast-message';
import * as ImagePicker from 'expo-image-picker';

export default function PostForm({ formTitle, titlePlaceHolder, areaPlaceHolder, collection }) {
  const { user } = useContext(DataContext);
  const [title, setTitle] = useState("");
  const [contactName, setContactName] = useState(user.user.providerData[0].displayName);
  const [area, setArea] = useState("");
  const [desc, setDesc] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [pic, setPic] = useState(null);

  const saveForm = async () => {
    let [cNameError, cNameMessageError] = validatePostContactName(contactName);
    let [cNumberError, cNumberMessageError] = validatePostContactNumber(contactNumber);
    let [titleError, titleMessageError] = validatePostTitle(title);
    let [areaError, areaMessageError] = validatePostArea(area)
    if (cNameError || cNumberError || titleError || areaError) {
      let messageError = ""
      // solo se puede mostrar un toast
      cNumberError ? messageError = `• ${cNumberMessageError}` : ""
      areaError ? messageError = `• ${areaMessageError}` : ""
      cNameError ? messageError = `• ${cNameMessageError}` : ""
      titleError ? messageError = `• ${titleMessageError}` : ""

      Toast.show({ type: "error", text1: "Por favor revise el formulario", text2: messageError, })
    } else {
      let id = await createPost(collection, {
        title,
        contactName,
        desc,
        wpp: contactNumber,
        zone: area,
        timestamp: Date.now()
      })
    }
  }

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert("Perdon, necesitamos los permisos de la galeria para continuar.");
        }
      }
    })();
  }, []);

  const readImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1
    })
    console.log(result);
    if (!result.cancelled) {
      setPic(result.uri);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.paragraph}>
        {formTitle}
      </Text>
      <Text style={styles.formItemTitle}>
        Título
      </Text>
      <TextInput style={styles.input}
        placeholder={titlePlaceHolder}
        value={title}
        onChangeText={text => setTitle(text)} />
      <Text
        style={styles.formItemTitle}>
        Contacto
      </Text>
      <TextInput style={styles.input}
        placeholder="Nombre del contacto"
        value={contactName}
        onChangeText={text => setContactName(text)} />
      <Text
        style={styles.formItemTitle}>
        Zona
      </Text>
      <TextInput style={styles.input}
        placeholder={areaPlaceHolder}
        value={area}
        onChangeText={text => setArea(text)} />
      <Text
        style={styles.formItemTitle}>
        Descripción
      </Text>
      <TextInput style={styles.inputMultiline}
        multiline={true}
        placeholder="Ingresa raza, color, tamaño y cualquier información que ayude a la identificación"
        value={desc}
        onChangeText={text => setDesc(text)} />
      <Text
        style={styles.formItemTitle}>
        Whatsapp
      </Text>
      <TextInput style={styles.input}
        placeholder="Sin +54 9 y con 11. Ej: 1122334455"
        keyboardType="phone-pad"
        value={contactNumber}
        onChangeText={text => setContactNumber(text)} />
      <Text
        style={styles.formItemTitle}>
        Agregar una foto
      </Text>
      <TouchableHighlight style={styles.imageContainer} onPress={readImage}>
        <View>
          {pic
            ? <Image source={{ uri: pic }} style={styles.singleImage} />
            : <Image source={require("../assets/add-picture-icon.png")} style={styles.singleImage} />}
        </View>
      </TouchableHighlight>
      <Button title="Publicar" onPress={saveForm} />
      <Toast />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#ecf0f1',
    padding: 8
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
  }, formItemTitle: {
    margin: 5,
    fontSize: 14,
    fontWeight: '700'
  },
  input: {
    height: 40,
    margin: 5,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  inputMultiline: {
    height: 100,
    margin: 5,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    textAlignVertical: 'top',
  },
  imageContainer: {
    display: "flex",
    alignItems: 'center',
    justifyContent: 'center',
  },
  singleImage: {
    margin: 20,
    width: 60,
    height: 60
  }
})
