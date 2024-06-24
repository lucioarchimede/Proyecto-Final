import React, { Component } from "react";
import {View,Text,TextInput,StyleSheet,TouchableOpacity,} from "react-native";
import { auth } from "../firebase/config";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      password: "",
      email: "",
      error: "",
    };
  }

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.props.navigation.navigate("Home");
      }
      this.setState({
        logueado: true
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
    borderColor: "#FF4500", 
    borderWidth: 2, 
    borderRadius: 8, 
    marginBottom: 20,
    padding: 10, 
    backgroundColor: "#FFF8DC",
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.25,
    shadowRadius: 3.84, 
    elevation: 5,
  },
  btn: {
    backgroundColor: "#32CD32", 
    textAlign: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25, 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 4.65,
    elevation: 8, 
    marginVertical: 10, 
  },
  textBtn: {
    color: "#FFF", 
    fontWeight: "bold", 
    fontSize: 18, 
    letterSpacing: 1, 
    textShadowColor: "#000", 
    textShadowOffset: { width: 1, height: 1 }, 
    textShadowRadius: 2, 
  },
});


export default Login;
