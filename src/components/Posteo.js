import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Like from "../components/Like"
import { db, auth } from "../firebase/config";
import firebase from "firebase";

export default class Posteo extends Component {
  constructor(props) {
    super(props);
  }

  irComentarios() {
    this.props.navigation.navigate("Comentarios", { id: this.props.id });
  }

  irAlPerfil() {
    this.props.data.owner === auth.currentUser.correo
      ? this.props.navigation.navigate('Perfil')
      : this.props.navigation.navigate('UsersProfile', { user: this.props.data.owner });
  }

  render() {
    const { data } = this.props;

    return (
      <View style={styles.posts}>
        <TouchableOpacity onPress={() => this.irAlPerfil()}>
          <Text style={styles.ownerName}>{this.props.data.owner}</Text>
        </TouchableOpacity>
        <View>
          <Image
            source={{ uri: data.fotoUrl ? data.fotoUrl : "" }}
            style={styles.img}
            resizeMode="contain"
          />
          <Text style={styles.description}>{data.descripcion}</Text>
          <View>
          <Like postId={this.props.id} likes={this.props.data.likes} />
          </View>
        </View>
        <View>
          <View>
            <TouchableOpacity onPress={() => this.irComentarios()}>
              <Text style={styles.commentText}>
                {" "}
                {data.comentarios
                  ? data.comentarios.length
                  : 0} Comentarios{" "}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  img: {
    width: "100%",
    height: 200,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  posts: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 15,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#DDD",
    width: "auto",
  },
  ownerName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333333",
  },
  description: {
    fontSize: 15,
    color: "#666666",
    marginBottom: 12,
  },
  commentText: {
    color: "#5F866F",
    fontSize: 16,
    fontWeight: "bold",
    padding: 15,
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
    textAlign: "center",
    marginVertical: 10,
  },
});
