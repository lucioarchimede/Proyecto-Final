import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { db } from '../firebase/config';
import FormComents from '../components/FormComents';



export default class Comentarios extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataPosteo: null,
        };
    }

    componentDidMount() {
        this.unsubscribe = db
            .collection('posteos')
            .doc(this.props.route.params.id)
            .onSnapshot((doc) => {
                this.setState({ dataPosteo: doc.data() });
            });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Comentarios</Text>
                {this.state.dataPosteo !== null && this.state.dataPosteo.comentarios !== undefined ? (
                    <View style={styles.commentsContainer}>
                        <FlatList
                            data={this.state.dataPosteo.comentarios
                                .slice()
                                .sort((a, b) => b.createdAt - a.createdAt)}
                            keyExtractor={(item) => item.createdAt.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.commentContainer}>
                                    <Text style={styles.ownerText}>{item.owner}</Text>
                                    <Text style={styles.commentText}>{item.coment}</Text>
                                </View>
                            )}
                        />
                    </View>
                ) : (
                    <Text>Aún no hay comentarios.</Text>
                )}
                <FormComents posteoId={this.props.route.params.id} />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 15,
      backgroundColor: '#F7F9F9',
    },
    title: {
      fontSize: 22,
      fontWeight: '700',
      marginBottom: 15,
      color: '#333333',
      textAlign: 'center',
    },
    commentsContainer: {
      backgroundColor: '#D4ECDD',
      borderRadius: 15,
      padding: 15,
      alignSelf: 'center',
      width: '80%',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 4,
    },
    commentContainer: {
      marginBottom: 15,
      backgroundColor: '#FFFFFF',
      padding: 10,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    ownerText: {
      fontWeight: '600',
      color: '#2C3E50',
      marginBottom: 8,
      fontSize: 16,
    },
    commentText: {
      color: '#2C3E50',
      fontSize: 14,
    },
  });
  