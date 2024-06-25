import React, { Component } from "react";
import {View,Text,TextInput,StyleSheet,TouchableOpacity,} from "react-native";
import { auth } from "../firebase/config";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logueado: false,
      name: "",
      password: "",
      email: "",
      error: "",
    };
  }

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.props.navigation.navigate("tabnav");
      }
      this.setState({
        logueado:true
      })
    });
  }

  onSubmit(email, password) {
    if (email === null || email === "" || !email.includes("@")) {
      this.setState({ error: "El email tiene un formato invalido" });
      return false;
    }
    if (password === null || password === "") {
      this.setState({
        error: "La contraseña no puede tener menos de 6 caracteres",
      });
      return false;
    }

    auth
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        this.setState({loggedIn:true})
        this.props.navigation.navigate("tabnav");
      })
      .catch((err) => {
        if (err.code === "auth/internal-error") {
          this.setState({ error: "contraseña incorrecta" });
        }
      });
  }
  redirect() {
    this.props.navigation.navigate("Register");
  }

  render() {
    return (
      <View>
        <Text>Loguea tu usuario</Text>

        <TextInput
          onChangeText={(text) => this.setState({ email: text, error: "" })}
          value={this.state.email}
          placeholder="Indica tu email"
          keyboardType="default"
          style={styles.input}
        />
        <TextInput
          onChangeText={(text) => this.setState({ password: text, error: "" })}
          value={this.state.password}
          placeholder="Indica tu contraseña"
          keyboardType="default"
          secureTextEntry
          style={styles.input}
        />
        <TouchableOpacity
          style={styles.btn}
          onPress={() => this.onSubmit(this.state.email, this.state.password)}
        >
          <Text style={styles.textBtn}> Loguearme </Text>
        </TouchableOpacity>
        <View>
          <Text>
            No tenes una cuenta?
            <TouchableOpacity onPress={() => this.redirect()}>
              {" "}
              Ingresa aqui
            </TouchableOpacity>
          </Text>
        </View>
        {this.state.error !== "" ? <Text>{this.state.error}</Text> : ""}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    borderColor: "#FF4500", // Cambia el color del borde a un tono más vibrante
    borderWidth: 2, // Aumenta el ancho del borde
    borderRadius: 8, // Aumenta el radio del borde para esquinas más redondeadas
    marginBottom: 20, // Ajusta el margen inferior
    padding: 10, // Añade relleno interno para mejor apariencia
    backgroundColor: "#FFF8DC", // Fondo color crema claro
    shadowColor: "#000", // Añade sombra
    shadowOffset: { width: 0, height: 2 }, // Offset de la sombra
    shadowOpacity: 0.25, // Opacidad de la sombra
    shadowRadius: 3.84, // Radio de la sombra
    elevation: 5, // Elevación para Android
  },
  btn: {
    backgroundColor: "#32CD32", // Un verde lima más llamativo
    textAlign: "center",
    paddingVertical: 12, // Padding vertical aumentado
    paddingHorizontal: 20, // Padding horizontal
    borderRadius: 25, // Bordes completamente redondeados
    shadowColor: "#000", // Añade sombra
    shadowOffset: { width: 0, height: 4 }, // Offset de la sombra
    shadowOpacity: 0.3, // Opacidad de la sombra
    shadowRadius: 4.65, // Radio de la sombra
    elevation: 8, // Elevación para Android
    marginVertical: 10, // Margen vertical para separar de otros elementos
  },
  textBtn: {
    color: "#FFF", // Color de texto blanco
    fontWeight: "bold", // Texto en negrita
    fontSize: 18, // Tamaño de fuente aumentado
    letterSpacing: 1, // Espaciado entre letras
    textShadowColor: "#000", // Sombra de texto
    textShadowOffset: { width: 1, height: 1 }, // Offset de la sombra del texto
    textShadowRadius: 2, // Radio de la sombra del texto
  },
});


export default Login;
