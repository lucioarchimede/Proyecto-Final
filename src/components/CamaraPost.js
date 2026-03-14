import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import React, { Component } from "react";
import { Camera } from "expo-camera";
import { storage } from "../firebase/config";

export default class CamaraPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mostrarCamara: true,
      permisos: false,
      urlTemp: "",
    };
    this.metodosDeCamara = null;
  }

  componentDidMount() {
    Camera.requestCameraPermissionsAsync()
      .then((resp) => this.setState({ permisos: true }))
      .catch((err) => console.log(err));
  }

  sacarFoto() {
    this.metodosDeCamara
      .takePictureAsync()
      .then((imgTemp) =>
        this.setState({
          urlTemp: imgTemp.uri,
          mostrarCamara: false,
        })
      )
      .catch((err) => console.log(err));
  }

  aceptarFoto() {
    fetch(this.state.urlTemp)
      .then((resp) => resp.blob())
      .then((img) => {
        const ref = storage.ref(`fotos/${Date.now()}.jpg`);
        ref
          .put(img)
          .then((resp) => {
            ref
              .getDownloadURL()
              .then((url) => this.props.actualizarFotourl(url));
            this.props.onFotoSubida();
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }

  rechazarFoto() {
    this.setState({
      mostrarCamara: true,
      urlTemp: "",
    });
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.permisos && this.state.mostrarCamara ? (
          <>
            <Camera
              style={styles.camara}
              type={Camera.Constants.Type.back}
              ref={(metodosDeCamara) =>
                (this.metodosDeCamara = metodosDeCamara)
              }
            />
            <TouchableOpacity
              onPress={() => this.sacarFoto()}
              style={styles.btnContainer}
            >
              <Text style={styles.btn}>Tomar foto</Text>
            </TouchableOpacity>
          </>
        ) : this.state.permisos && !this.state.mostrarCamara ? (
          <>
            <Image
              source={{ uri: this.state.urlTemp }}
              style={styles.img}
              resizeMode={"contain"}
            />
            <View style={styles.btnContainer}>
              <TouchableOpacity onPress={() => this.aceptarFoto()}>
                <Text style={styles.btn}>Aceptar Foto</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.rechazarFoto()}>
                <Text style={styles.btn}>Rechazar Foto</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <Text>No tienes permisos para usar la cámara</Text>
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  camara: {
    flex: 1,
    width: "100%",
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 20,
  },
  img: {
    height: 500,
    width: 500,
    borderRadius: 15,
    marginBottom: 20,
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 20,
    position: "absolute",
    bottom: 20,
  },
  btn: {
    backgroundColor: "#5F866F",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  textoBtn: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
