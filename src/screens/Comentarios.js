import React, { Component } from "react";
import { View, Text, FlatList, StyleSheet, ScrollView } from "react-native";
import { db } from "../firebase/config";
import FormComents from "../components/FormComents";

export default class Comentarios extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postData: null,
    };
  }

  componentDidMount() {
    this.unsubscribe = db
      .collection("posteos")
      .doc(this.props.route.params.id)
      .onSnapshot((doc) => {
        this.setState({ postData: doc.data() });
      });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Comentarios</Text>
          {this.state.postData !== null &&
          this.state.postData.comentarios !== undefined ? (
            <View style={styles.commentsContainer}>
              <FlatList
                data={this.state.postData.comentarios
                  .slice()
                  .sort((a, b) => b.createdAt - a.createdAt)}
                keyExtractor={(item) => item.createdAt.toString()}
                renderItem={({ item }) => (
                  <View style={styles.commentContainer}>
                    <Text style={styles.ownerText}>{item.owner}</Text>
                    <Text style={styles.commentText}>{item.coment}</Text>
                  </View>
                )}
                scrollEnabled={false}
              />
            </View>
          ) : (
            <Text style={styles.noCommentsText}>Aún no hay comentarios.</Text>
          )}
          <FormComents posteoId={this.props.route.params.id} />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
  },
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#F7F9F9",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 15,
    color: "#333333",
    textAlign: "center",
  },
  commentsContainer: {
    backgroundColor: "#D4ECDD",
    borderRadius: 15,
    padding: 15,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  commentContainer: {
    marginBottom: 15,
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  ownerText: {
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 8,
    fontSize: 16,
  },
  commentText: {
    color: "#2C3E50",
    fontSize: 14,
  },
  noCommentsText: {
    textAlign: "center",
    color: "#999999",
    marginTop: 20,
  },
});
