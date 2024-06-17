import { Component } from "react";
import { View, Text, StyleSheet, Image, FlatList, TextInput } from "react-native"


const dummyArray = [{
    id: 1,
    name: "Pepe",
    age: 35,
    music: "Rock"
},
{
    id: 2,
    name: "Lucio",
    age: 30,
    music: "Pop"
},
{
    id: 3,
    name: "Juan",
    age: 25,
    music: "Reggae"
},
{
    id: 4,
    name: "Chris",
    age: 15,
    music: "Trap"
},
{
    id: 5,
    name: "Ricardo",
    age: 55,
    music: "No le gusta nada"
},
]


class FlexDemo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
        }
        console.log(this.state.email);
    }




    render() {
        return (
            <View style={styles.contenedor}>

                <View style={styles.containerUno}>
                    <Text> Soy la caja 1  Formulario de Login</Text>

                    <TextInput
                        placeholder="Ingresa tu email"
                        style={styles.input}
                        onChangeText={(text) => this.setState({ email: text })}
                        value={this.state.email} />



                    <TextInput
                        placeholder="Ingresa tu password"
                        style={styles.input}
                        onChangeText={(text) => this.setState({ password: text })}
                        value={this.state.password} />
                </View>


                <View style={styles.containerDos}>
                    <Text> Soy la caja 2 </Text>

                    <Image
                        style={styles.imgPerrito}
                        resizeMode="contain"
                        source={require("../../assets/perrito.jpeg")}
                    />

                    <FlatList
                        data={dummyArray}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => <View>
                            <Text>{item.name}</Text>
                            <Text>{item.age}</Text>
                            <Text>{item.music}</Text>
                        </View>} />

                </View>


                <View style={styles.containerTres}>
                    <Text> Soy la caja 3 </Text>
                </View>

            </View>


        )
    }
}

const styles = StyleSheet.create({
    contenedor: {
        flex: 1,
    },

    containerUno: {
        flex: 3,
        backgroundColor: "white"
    },

    containerDos: {
        flex: 4,
        backgroundColor: "green",
    },

    imgPerrito: {
        height: 200
    },

    containerTres: {
        flex: 1,
        backgroundColor: "blue"
    },
    input: {
        borderBlockColor: "green",
        borderBottomWidth: 2
    },
})


export default FlexDemo