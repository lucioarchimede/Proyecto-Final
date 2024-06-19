import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, FlatList, Image, Modal, Pressable } from 'react-native';
import { auth, db } from '../firebase/config';
import Posteo from '../components/Posteo';

export default class MiPerfil extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usuario: null, //Esto hay que cambiarlo esta en Null pq no me anda 
      posteos: [],
      seleccionPosteoId: null,
      modalVisible: false,
    };
  }

  componentDidMount() {
    this.obtenerDatosUsuario();
    this.obtenerPosteosUsuario();
  }

  obtenerDatosUsuario() {
    db.collection('usuarios')
      .where('owner', '==', auth.currentUser.email)
      .onSnapshot((docs) => {
        let usuario = null;
        docs.forEach((doc) => {
          usuario = {
            id: doc.id,
            data: doc.data(),
          };
        });
        console.log('Datos del usuario:', usuario);  // Depuración
        this.setState({ usuario });
      });
  }

  obtenerPosteosUsuario() {
    db.collection('posteos')
      .where('owner', '==', auth.currentUser.email)
      .onSnapshot((docs) => {
        let data = [];
        docs.forEach((doc) => {
          data.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        data.sort((a, b) => b.data.createdAt - a.data.createdAt);
        console.log('Posteos del usuario:', data);  // Depuración
        this.setState({
          posteos: data,
        });
      });
  }

  confirmarEliminacion = async (posteoId) => {
    try {
      await db.collection('posteos').doc(posteoId).delete();
      console.log('Posteo eliminado');
      const updatedPosteos = this.state.posteos.filter(post => post.id !== posteoId);
      this.setState({
        posteos: updatedPosteos,
        modalVisible: false,
      });
    } catch (error) {
      console.error('Error al eliminar posteo:', error);
    }
  }

  borrarPosteo = (posteoId) => {
    this.setState({
      seleccionPosteoId: posteoId,
      modalVisible: true,
    });
  }

  cerrarModal = () => {
    this.setState({
      seleccionPosteoId: null,
      modalVisible: false,
    });
  }

  logout = () => {
    auth.signOut();
    this.props.navigation.navigate('Login');
  }

  handleChangePassword = () => {
    this.props.navigation.navigate('CambioClave');
  };

  handleEditProfile = () => {
    this.props.navigation.navigate('EditarPerfil');
  };

  render() {
    const { usuario, posteos } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.postsTitle}>Tu perfil</Text>
        {usuario ? (
          <View style={styles.profileInfo}>
            <Text style={styles.username}>{usuario.data.name}</Text>
            {usuario.data.fotoPerfil && (
              <Image source={{ uri: usuario.data.fotoPerfil }} style={styles.profileImage} />
            )}
            <Text style={styles.mail}>{usuario.data.owner}</Text>
            <Text style={styles.minibio}>{usuario.data.miniBio}</Text>
            <TouchableOpacity onPress={this.handleEditProfile}>
              <Text style={styles.editProfileButton}>Editar Perfil</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text>Cargando...</Text>
        )}

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
                  <Posteo navigation={this.props.navigation} data={item.data} id={item.id} />
                </View>
              )}
            />
          </View>
        </View>

        <View style={styles.changePasswordButton}>
          <TouchableOpacity onPress={this.handleChangePassword}>
            <Text>Cambiar Contraseña</Text>
          </TouchableOpacity>
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
              <Text style={styles.modalText}>¿Estás seguro de que quieres borrar este posteo?</Text>
              <View style={styles.modalButtons}>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => this.cerrarModal()}
                >
                  <Text style={styles.textStyle}>Cancelar</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.buttonConfirm]}
                  onPress={() => this.confirmarEliminacion(this.state.seleccionPosteoId)}
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
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: "lightblue",
    padding: 10,
  },
  profileInfo: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mail: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  username: {
    fontSize: 25,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
  minibio: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
  },
  posts: {
    flex: 1,
    width: '100%',
    marginTop: 20,
  },
  postsList: {
    flex: 1,
    width: '100%',
  },
  postsTitle: {
    fontSize: 35,
    fontWeight: 'bold',
    fontFamily: 'calibri',
    marginBottom: 15,
    textAlign: 'center',
  },
  post: {
    width: '90%',
    alignSelf: 'center',
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logout: {
    marginVertical: 20,
  },
  cantidadPosteos: {
    marginBottom: 15,
  },
  editProfileButton: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'none',
    marginTop: 10,
  },
  changePasswordButton: {
    marginTop: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    borderRadius: 5,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  buttonConfirm: {
    backgroundColor: '#FF6347',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
