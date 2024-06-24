import React, { Component } from "react";
import { db } from "../firebase/config";
import {TextInput,TouchableOpacity,View,Text,StyleSheet,FlatList} from "react-native";


class Search extends Component {
    constructor() {
        super();
        this.state = {
            backup: [],
            userId: "",
            infoUsuario: null,
            usuarios: [],
            campoBusqueda: "",
            filter1: [],
            filter2: [],
           

        }
    }


    componentDidMount() {
        db.collection("users").onSnapshot(
            docs => {
                let usuarios = [];
                docs.forEach(doc => {

                    usuarios.push({
                        id: doc.id,
                        data: doc.data()
                    })
                })
                this.setState({ backup: usuarios })
            }
        )
    }

    busqueda() {
        let filtradoUsuarios = this.state.backup.filter(elm => {
            if (elm.data.owner.toLowerCase().includes(this.state.campoBusqueda.toLowerCase())) {
                return elm
            }
        })
        this.setState({ filter1: filtradoUsuarios })
        
        let filtradoUsuarios2 = this.state.backup.filter(elm => {
            if (elm.data.owner.toLowerCase().includes(this.state.campoBusqueda.toLowerCase())) {
                return elm
            }
        })
        this.setState({ filter2: filtradoUsuarios2 })
    }

    usuarioSeleccionado(userId) {
        this.props.navigation.navigate("UsersProfile", userId)
    }

    render() {
        console.log(this.state.filter1.length)
        return (
            <View style={styles.formContainer}>
                <View style={styles.container}>

    
                            <View style={styles.containerBusqueda}>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={(text) => this.setState({ campoBusqueda: text })}
                                    placeholder="Nombre de usuario o email"
                                    keyboardType="default"
                                    value={this.state.campoBusqueda}
                                />
                                <TouchableOpacity style={styles.button} onPress={() => this.busqueda()}>
                                    <Text style={styles.textoBoton}>Buscar</Text>
                                </TouchableOpacity>
                            </View>


                    {
                        this.state.filter1.length > 0 ?

                            <View style={styles.containerUsuario}>
                                <Text style={styles.textoo}>RESULTADOS DE BÚSQUEDA PARA: {this.state.campoBusqueda}</Text>
                                <Text style={styles.textoo}>MAILS:</Text>
                                <FlatList
                                    data={this.state.filter1}
                                    keyExtractor={unUsuario => unUsuario.id}
                                    renderItem={({ item }) =>
                                        <TouchableOpacity style={styles.botonUsuario} onPress={() => this.usuarioSeleccionado(item.data.email)}>
                                            <Text style={styles.usuario} >{item.data.owner}</Text>
                                        </TouchableOpacity>
                                    }
                                />

                                <Text style={styles.textoo}>NOMBRES DE USUARIO: </Text>
                                <FlatList
                                    data={this.state.filter2}
                                    keyExtractor={unUsuario => unUsuario.id}
                                    renderItem={({ item }) =>
                                        <TouchableOpacity style={styles.botonUsuario} onPress={() => this.usuarioSeleccionado(item.data.name)}>
                                            <Text style={styles.usuario} >{item.data.name}</Text>
                                        </TouchableOpacity>
                                    }
                                />

                            </View> 
                            
                            : 
                            <View>
                                <Text> No existe el email/usuario que busca</Text>
                            </View>
                    }

                </View>




            </View>

        )
    }
}

const styles = StyleSheet.create({
    itemUsuario: {
      color: "#333", 
      padding: 20,
      borderColor: "#FF6347", 
      borderWidth: 2,
      borderRadius: 10, 
      marginBottom: 10, 
      backgroundColor: "#FAFAFA", 
      shadowColor: "#000", 
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3, 
    },
    formContainer: {
      paddingHorizontal: 15, 
      marginTop: 20,
      backgroundColor: "#E6F7FF",
      borderRadius: 10, 
      paddingVertical: 20, 
    },
    container: {
      backgroundColor: "#FFFFFF",
      borderRadius: 12, 
      margin: 10,
      padding: 20, 
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 }, 
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 5,
      flex: 1,
      alignItems: "flex-start",
      justifyContent: "center",
    },
    containerBusqueda: {
      flex: 1,
      flexDirection: "row",
      width: "100%",
      alignItems: "center",
      backgroundColor: "#F0F8FF", 
      padding: 10, 
      borderRadius: 8,
      marginVertical: 10,
    },
    containerUsuario: {
      backgroundColor: "#FFFFFF",
      borderRadius: 10,
      margin: 10,
      padding: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
    },
    input: {
      height: 40, 
      paddingVertical: 10,
      paddingHorizontal: 15, 
      borderWidth: 1,
      borderColor: "#B0C4DE",
      borderRadius: 8, 
      marginVertical: 10,
      width: "80%",
      backgroundColor: "#FFFFFF", 
    },
    image: {
      width: 60, 
      height: 60,  
      borderRadius: 30,  
      borderWidth: 2,
      borderColor: "#32CD32", 
      marginRight: 15,  
    },
    button: {
      backgroundColor: "#4B0082", 
      paddingHorizontal: 15,
      paddingVertical: 10,  
      textAlign: "center",
      borderRadius: 8, 
      borderWidth: 1,
      borderColor: "#9400D3",  
      width: "30%",
      height: 40,  
      justifyContent: "center",
      alignItems: "center",  
      marginVertical: 10,
    },
    textoBoton: {
      textAlign: "center",
      color: "#FFFFFF", 
      fontWeight: "bold",  
      fontSize: 16, 
    },
    botonUsuario: {
      backgroundColor: "#4682B4", 
      paddingHorizontal: 20,  
      paddingVertical: 10, 
      borderRadius: 8,  
      borderWidth: 1,
      borderColor: "#00008B", 
      width: "50%",  
      height: 40,  
      justifyContent: "center",
      alignItems: "center",  
      marginVertical: 10,  
    },
    textoo: {
      marginTop: 10,
      marginBottom: 10,
      fontSize: 16, 
      color: "#333", 
    },
  });
  

export default Search;