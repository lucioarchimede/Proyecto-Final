import { Text, View, StyleSheet, FlatList, Image } from "react-native";
import React, { Component } from "react";
import { db } from "../firebase/config";
import Posteo from "../components/Posteo";

export default class UsersProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      posteos: [],
    };
  }

  componentDidMount() {
    db.collection("users")
      .where("owner", "==", this.props.route.params.user)
      .onSnapshot((docs) => {
        let arrDocs = [];
        docs.forEach((doc) => {
          arrDocs.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        this.setState(
          {
            users: arrDocs,
          },
          () => console.log(this.state.users)
        );
      });

    db.collection("posteos")
      .where("owner", "==", this.props.route.params.user)
      .onSnapshot((docs) => {
        let arrDocs = [];
        docs.forEach((doc) => {
          arrDocs.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        arrDocs.sort((a, b) => b.data.createdAt - a.data.createdAt);
        this.setState(
          {
            posteos: arrDocs,
          },
          () => console.log(this.state.posteos)
        );
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.profileInfo}>
          <FlatList
            data={this.state.users}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View>
                <Text style={styles.username}>{item.data.name}</Text>
                {item.data.fotoPerfil != "" ? (
                  <Image
                    source={item.data.profileImage}
                    style={styles.img}
                    resizeMode="contain"
                  />
                ) : (
                  ""
                )}
                <Text style={styles.owner}>{item.data.owner}</Text>
                {item.data.miniBio ? (
                  <Text style={styles.miniBio}>{item.data.miniBio}</Text>
                ) : (
                  ""
                )}
              </View>
            )}
          />
        </View>
        <View style={styles.posts}>
          <Text style={styles.postsTitle}>
            Posteos de {this.props.route.params.user}{" "}
          </Text>
          <Text style={styles.cantidadPosteos}>
            Cantidad: {this.state.posteos.length}{" "}
          </Text>
          <FlatList
            data={this.state.posteos}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.posteos}>
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
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  profileInfo: {
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 10,
  },
  email: {
    fontSize: 16,
    color: "gray",
    marginBottom: 10,
    textAlign: "center",
  },
  biografia: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
  },
  postsContainer: {
    flex: 1,
  },
  postsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  postCount: {
    fontSize: 16,
    color: "#333",
    marginBottom: 15,
  },
  post: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },
});
