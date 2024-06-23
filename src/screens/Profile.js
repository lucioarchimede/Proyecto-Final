import React, { Component } from "react";
import {Text,View,TouchableOpacity,StyleSheet,FlatList,Image,Modal,Pressable,} from "react-native";
import { auth, db } from "../firebase/config";
import Posteo from "../components/Posteo";

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usuario: [],
      posteos: [],
      seleccionPosteoId: null,
      modalVisible: false,
    };
  }

  componentDidMount() {
    db.collection("users")
      .where("owner", "==", auth.currentUser.email)
      .onSnapshot((docs) => {
        let datos = [];
        docs.forEach((doc) => {
          datos.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        this.setState({
          usuarios: datos,
        });
      });

    db.collection("posteos")
      .where("owner", "==", auth.currentUser.email)
      .onSnapshot((docs) => {
        let data = [];
        docs.forEach((doc) => {
          data.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        data.sort((a, b) => b.data.createdAt - a.data.createdAt);
        console.log("Posteos del usuario:", data); // Depuración
        this.setState({
          posteos: data,
        });
      });
  }
  confirmarEliminacion = async (posteoId) => {
    try {
      await db.collection("posteos").doc(posteoId).delete();
      console.log("Posteo eliminado");
      const posteosActualizados = this.state.posteos.filter(
        (post) => post.id !== posteoId
      );
      this.setState({
        posteos: posteosActualizados,
        modalVisible: false,
      });
    } catch (error) {
      console.error("Error al eliminar posteo:", error);
    }
  };

  borrarPosteo = (posteoId) => {
    this.setState({
      seleccionPosteoId: posteoId,
      modalVisible: true,
    });
  };

  cerrarModal = () => {
    this.setState({
      seleccionPosteoId: null,
      modalVisible: false,
    });
  };

  logout = () => {
    auth.signOut();
    this.props.navigation.navigate("Login");
  };

  render() {
    const { posteos } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Tu perfil</Text>
        <FlatList
          data={this.state.usuarios}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.profileInfo}>
              <Image source={{ uri: item.data.fotoPerfil }} style={styles.profileImage} />
              <Text style={styles.username}>{item.data.name}</Text>
              <Text style={styles.mail}>{item.data.owner}</Text>
              <Text style={styles.minibio}>{item.data.miniBio}</Text>
            </View>
          )}
        />

        <View style={styles.posts}>
          <Text style={styles.postsTitle}>Tus posteos</Text>
          <Text style={styles.cantidadPosteos}>Posteos: {posteos.length}</Text>
          <View style={styles.postsList}>
            <FlatList
              data={posteos}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.post}>
                  <TouchableOpacity onPress={() => this.borrarPosteo(item.id)}>
                    <Text>Borrar</Text>
                  </TouchableOpacity>
                  <Posteo
                    navigation={this.props.navigation}
                    data={item.data}
                    id={item.id}
                  />
                </View>
              )}
            />
          </View>
        </View>
        <View style={styles.logout}>
          <TouchableOpacity onPress={this.logout}>
            <Text>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.cerrarModal();
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                ¿Estás seguro de que quieres borrar este posteo?
              </Text>
              <View style={styles.modalButtons}>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => this.cerrarModal()}
                >
                  <Text style={styles.textStyle}>Cancelar</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.buttonConfirm]}
                  onPress={() =>
                    this.confirmarEliminacion(this.state.seleccionPosteoId)
                  }
                >
                  <Text style={styles.textStyle}>Borrar</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#E6F7FF", 
    padding: 20,
  },
  profileInfo: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  mail: {
    fontSize: 16, 
    color: "#888888",
    textAlign: "center",
    marginVertical: 5, 
  },
  profileImage: {
    width: 150, 
    height: 150,
    borderRadius: 75, 
    borderWidth: 2,
    borderColor: "#32CD32", 
    marginBottom: 10,
  },
  username: {
    fontSize: 28, 
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
    color: "#333333", 
  },
  minibio: {
    fontSize: 16,
    color: "#888888", 
    textAlign: "center",
    marginVertical: 5,
  },
  posts: {
    flex: 1,
    width: "100%",
    marginTop: 20,
    padding:20,
    elevation:10
    
  },
  postsList: {
    flex: 1,
    width: "100%",
  },
  postsTitle: {
    fontSize: 35,
    fontWeight: "bold",
    fontFamily: "calibri",
    marginBottom: 15,
    textAlign: "center",
    color: "#FF4500", 
  },
  post: {
    width: "95%", 
    alignSelf: "center",
    marginBottom: 20, 
    backgroundColor: "#FFFFFF",
    borderRadius: 15, 
    padding: 25, 
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4, 
    },
    shadowOpacity: 0.3,
    shadowRadius: 5, 
    elevation: 10, 
  },
  logout: {
    marginVertical: 20,
  },
  cantidadPosteos: {
    marginBottom: 15,
    fontSize: 16, 
    color: "#555555", 
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20, 
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4, 
    },
    shadowOpacity: 0.3,
    shadowRadius: 5, 
    elevation: 10, 
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18, 
    color: "#333333", 
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  button: {
    borderRadius: 10, 
    padding: 10,
    elevation: 2,
    marginHorizontal: 10, 
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  buttonConfirm: {
    backgroundColor: "#FF6347", 
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});




