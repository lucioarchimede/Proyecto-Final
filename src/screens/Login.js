import React, {Component} from 'react'
import {View, Text, TextInput, StyleSheet, TouchableOpacity} from 'react-native'
import { auth } from '../firebase/config'

class Login extends Component {
    constructor(props){
        super(props)
        this.state = {
            name:'',
            password:'',
            email:'',
            error: ''
        }
    }


componentDidMount(){
    auth.onAuthStateChanged((user)=>{
        if (user) {
            console.log("este es el email logueado", auth.currentUser.email);
        }
    })
}





    onSubmit(email, password){
        if(
            email === null || email === '' || !email.includes('@')
        ){
            this.setState({error: 'El email tiene un formato invalido'})
            return false
        }
        if(

            password === null || password === '' 
        ){
            this.setState({error: 'La password no puede ser menor de 6 caracteres'})
            return false
        }

        auth.signInWithEmailAndPassword(email, password)
        .then((user)=>{
            this.props.navigation.navigate("tabnav")
        })
        .catch((err)=> {
            if (err.code === "auth/internal-error") {
                this.setState({error: "contraseña incorrecta"})
            }
        })



    }
    redirect(){
        this.props.navigation.navigate("Register")
    }


    render(){
        return(
            <View>
                <Text>Loguea tu usuario</Text>
               
                <TextInput
                    onChangeText={(text) => this.setState({email: text, error: ''})}
                    value={this.state.email}
                    placeholder='Indica tu email'
                    keyboardType='default'
                    style={styles.input}
                />
                <TextInput
                    onChangeText={(text) => this.setState({password: text, error: ''})}
                    value={this.state.password}
                    placeholder='Indica tu password'
                    keyboardType='default'
                    style={styles.input}
                />
                <TouchableOpacity
                    style={styles.btn}
                    onPress={()=> this.onSubmit(this.state.email, this.state.password)}
                >
                    <Text style={styles.textBtn}> Loguearme </Text>
                </TouchableOpacity>
                <View>
                    <Text>
                        No tenes una cuenta?
                        <TouchableOpacity
                        onPress={()=>this.redirect()}> Ingresa aqui</TouchableOpacity>
                    </Text>
                </View>
                {
                    this.state.error !== '' ?
                    <Text>
                        {this.state.error}
                    </Text>
                    : 
                    ''
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    input: {
        borderColor: 'red',
        borderWidth: 1,
        borderRadius:5,
        marginBottom:16
    },
    btn:{
        backgroundColor:'green',
        textAlign: 'center',
        padding: 10
    },
    textBtn: {
        color: 'white',

    }
})

export default Login