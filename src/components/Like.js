import React, { Component } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { db, auth } from "../firebase/config";
import firebase from "firebase";

export default class Like extends Component {
  constructor(props) {
    super(props);
    this.state = {
      likes: props.likes.length,
      controlarLike: props.likes.includes(auth.currentUser.email),
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.likes !== this.props.likes) {
      this.setState({
        likes: this.props.likes.length,
        controlarLike: this.props.likes.includes(auth.currentUser.email),
      });
    }
  }

  like() {
    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.email) {
      console.error("User is not authenticated or email is missing.");
      return;
    }

    // Deshabilitar el botón temporalmente
    this.setState({ disabled: true });

    db.collection("posteos")
      .doc(this.props.postId)
      .update({
        likes: firebase.firestore.FieldValue.arrayUnion(currentUser.email),
      })
      .then(() => {
        this.setState((prevState) => ({
          likes: prevState.likes + 1,
          controlarLike: true,
        }));
      })
      .catch((err) => console.log(err))
      .finally(() => {
        // Habilitar el botón de nuevo después de la operación
        this.setState({ disabled: false });
      });
  }

  unlike() {
    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.email) {
      console.error("User is not authenticated or email is missing.");
      return;
    }

    // Deshabilitar el botón temporalmente
    this.setState({ disabled: true });

    db.collection("posteos")
      .doc(this.props.postId)
      .update({
        likes: firebase.firestore.FieldValue.arrayRemove(currentUser.email),
      })
      .then(() => {
        this.setState((prevState) => ({
          likes: prevState.likes - 1,
          controlarLike: false,
        }));
      })
      .catch((err) => console.log(err))
      .finally(() => {
        // Habilitar el botón de nuevo después de la operación
        this.setState({ disabled: false });
      });
  }

  render() {
    return (
      <View>
        <Text>{this.props.likes.length}</Text>
        {this.state.controlarLike ? (
          <TouchableOpacity onPress={() => this.unlike()}>
            <FontAwesome name="heart" color="red" size={24} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => this.like()}>
            <FontAwesome name="heart-o" color="red" size={24} />
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
});
