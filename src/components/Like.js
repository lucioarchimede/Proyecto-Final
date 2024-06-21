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
      controlarLike: props.likes.includes(auth.currentUser.owner),
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.likes !== this.props.likes) {
      this.setState({
        likes: this.props.likes.length,
        controlarLike: this.props.likes.includes(auth.currentUser.owner),
      });
    }
  }

  like() {
    const owner = auth.currentUser.owner;
    if (!owner) {
      console.log('No owner defined.'); // Manejar caso de usuario no definido
      return;
    }
  
    db.collection("posteos")
      .doc(this.props.postId)
      .update({
        likes: firebase.firestore.FieldValue.arrayUnion(owner),
      })
      .then(() => {
        this.setState((prevState) => ({
          likes: prevState.likes + 1,
          controlarLike: true,
        }));
      })
      .catch((err) => console.log(err));
  }

  unlike() {
    db.collection("posteos")
      .doc(this.props.postId)
      .update({
        likes: firebase.firestore.FieldValue.arrayRemove(
          auth.currentUser.owner
        ),
      })
      .then(() => {
        this.setState((prevState) => ({
          likes: prevState.likes - 1,
          controlarLike: false,
        }));
      })
      .catch((err) => console.log(err));
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>
          {this.state.likes} {this.state.likes === 1 ? "Like" : "Likes"}
        </Text>
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
