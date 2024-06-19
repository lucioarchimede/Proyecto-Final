import React, { Component } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { db, auth } from '../firebase/config';
import firebase from 'firebase';

export default class FormularioComentarios extends Component {
    constructor(props) {
        super(props);
        this.state = {
            coment: '',
        };
    }

   comentar() {
        if (this.state.coment.trim() === '') {
            return; 
        }

        db.collection('posteos')
            .doc(this.props.posteoId)
            .update({
                comentarios: firebase.firestore.FieldValue.arrayUnion({
                    owner: auth.currentUser.email,
                    createdAt: Date.now(),
                    coment: this.state.coment,
                }),
            });

        this.setState({ coment: '' });
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.commentInputContainer}>
                    <TextInput
                        placeholder='Agrega tu coment'
                        keyboardType='default'
                        onChangeText={(text) => this.setState({ coment: text })}
                        value={this.state.coment}
                        multiline={true}
                        numberOfLines={4}
                        style={styles.commentInput}
                    />
                </View>
                <TouchableOpacity
                    onPress={() => this.comentar()}
                    disabled={!this.state.coment.trim()} 
                    style={styles.button}
                >
                    <Text>Comentar</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      marginVertical: 15,
      paddingHorizontal: 20,
      backgroundColor: '#F3F4ED',
      borderRadius: 10,
      alignItems: 'center',
    },
    commentInputContainer: {
      borderWidth: 1,
      borderColor: '#A3C4BC',
      borderRadius: 10,
      marginBottom: 15,
      padding: 5,
      backgroundColor: '#FFFFFF',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    commentInput: {
      paddingVertical: 8,
      paddingHorizontal: 15,
      fontSize: 16,
      color: '#333333',
    },
    button: {
      backgroundColor: '#A3C4BC',
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 10,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });
  