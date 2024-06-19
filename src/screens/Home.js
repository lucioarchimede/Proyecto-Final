import { Text, View, TouchableOpacity, StyleSheet, Image, FlatList, ActivityIndicator } from 'react-native'
import React, { Component } from 'react'
import { db } from "../firebase/config";
import Posteo from "../components/Posteo"

export default class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            posteos: []
        }
    }

    componentDidMount() {
        db.collection('posteos')
            .orderBy('createdAt', 'desc')
            .onSnapshot(docs => {
                let arrayPosteos = []
                docs.forEach(doc => {
                    const dataDePosteos = doc.data();
                    const owner = dataDePosteos.owner;
                    arrayPosteos.push({
                        id: doc.id,
                        data: dataDePosteos,
                        owner: owner 
                    })
                })
                this.setState({
                    posteos: arrayPosteos
                })
            })
    }

    render() {
        return (
            <View style={styles.posteos}>
                <FlatList 
                    data={this.state.posteos}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <Posteo
                        navigation={this.props.navigation}
                        data={item.data}
                        id={item.id}
                        owner={item.owner} 
                    />
                    )}
                />

            </View>
        )
    }
}

const styles = StyleSheet.create({
    posteos: {
      flex: 1,
      marginVertical: 25,
      marginBottom: 35,
      backgroundColor: '#FA8072',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      borderRadius: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 8,
      borderWidth: 1,
      borderColor: '#FF4500',
      width:"100%"
    },
  });
  