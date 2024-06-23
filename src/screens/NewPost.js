import {Text,View,TextInput,TouchableOpacity,StyleSheet} from "react-native";
import React, { Component } from "react";
import { db, auth } from "../firebase/config";
import CamaraPost from "../components/CamaraPost";

export default class NewPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      descripcion: "",
      urlFoto: "",
      paso1: true,
    };
  }

  onSubmit() {
    const { descripcion, urlFoto } = this.state;
    db.collection("posteos")
      .add({
        owner: auth.currentUser.email,
        createdAt: Date.now(),
        fotoUrl: urlFoto,
        descripcion: descripcion,
        likes: [],
      })
      .then(() => {
        this.setState({
          descripcion: "",
          urlFoto: "",
          paso1: true,
        });
        this.props.navigation.navigate("Home");
      })
      .catch((error) => console.error("Error al enviar el posteo:", error));
  }
  actualizarDescripcion(text) {
    this.setState({
      descripcion: text,
    });
  }

  actualizarFotourl(url) {
    this.setState({
      urlFoto: url,
      paso1: false,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Nuevo Posteo</Text>
        {this.state.paso1 ? (
          <View style={styles.cameraContainer}>
            <CamaraPost
              actualizarFotourl={(url) => this.actualizarFotourl(url)}
            />
          </View>
        ) : (
          <>
            <TextInput
              style={styles.descriptionInput}
              placeholder="Descripción"
              onChangeText={(descripcion) =>
                this.actualizarDescripcion(descripcion)
              }
              value={this.state.descripcion}
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => this.onSubmit()}
            >
              <Text style={styles.submitButtonText}>Enviar</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#e0f7fa', // Fondo azul muy claro
  },
  text: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#004d40', // Texto verde oscuro
    marginBottom: 20,
  },
  cameraContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
  },
  descriptionInput: {
    width: '100%',
    borderColor: '#90caf9', // Borde azul claro
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#e3f2fd', // Fondo azul claro
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#00796b', // Fondo verde turquesa oscuro
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  submitButtonText: {
    color: 'white', // Texto blanco para buen contraste
    fontWeight: 'bold',
    fontSize: 18,
  },
});
