import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { auth,db } from '../firebase/config'

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            password: '',
            email: '',
            miniBio: '',
            fotoPerfil: '', 
            error: '',
            textError: '',
        };
    }

    componentDidMount() {
        console.log("hizo el did mount y estas son sus props");
        console.log(this.props);
    }

    onSubmit = () => {
        const { name, email, password, miniBio, fotoPerfil } = this.state;
        if (name === null || name === '' || name.length < 5) {
            this.setState({ error: 'El nombre no puede ser menor de 5 caracteres' });
            return false;
        }
        if (email === null || email === '' || !email.includes('@')) {
            this.setState({ error: 'El email tiene un formato inválido' });
            return false;
        }
        if (password === null || password === '' || password.length < 6) {
            this.setState({ error: 'La contraseña no puede ser menor de 6 caracteres' });
            return false;
        }

        auth.createUserWithEmailAndPassword(email, password)
        .then(response => {
            console.log("Usuario creado:", response);
            db.collection("users").add({
                owner: email,
                createdAt: Date.now(),
                name: name,
                miniBio: this.state.miniBio ,
                fotoPerfil: this.state.fotoPerfil,
            })
            .then(() => {
                console.log("Usuario añadido a Firestore");
                this.props.navigation.navigate("Login");
            })
            .catch((error) => {
                this.setState({
                    textError: error.message
                });
                console.log("Error al añadir usuario a Firestore:", error);
            });
        })
        .catch((error) => {
            this.setState({
                textError: error.message
            });
            console.log("Error al crear usuario:", error);
        });
    }

    redirect() {
        this.props.navigation.navigate("Login");
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>Register</Text>

                <TextInput
                    onChangeText={(text) => this.setState({ name: text, error: '', textError: '' })}
                    value={this.state.name}
                    placeholder='Indica tu nombre'
                    keyboardType='default'
                    style={styles.input}
                />

                <TextInput
                    onChangeText={(text) => this.setState({ email: text, error: '', textError: '' })}
                    value={this.state.email}
                    placeholder='Indica tu email'
                    keyboardType='email-address'
                    style={styles.input}
                />

                <TextInput
                    onChangeText={(text) => this.setState({ password: text, error: '', textError: '' })}
                    value={this.state.password}
                    placeholder='Indica tu password'
                    keyboardType='default'
                    secureTextEntry
                    style={styles.input}
                />

                <TextInput
                    style={styles.input}
                    onChangeText={(bio) => this.setState({ miniBio: bio })}
                    placeholder='Cuéntanos algo sobre ti'
                    keyboardType='default'
                    value={this.state.miniBio}
                />

                <TextInput
                    style={styles.input}
                    onChangeText={(url) => this.setState({ fotoPerfil: url })}
                    placeholder='Agrega la URL de tu foto'
                    keyboardType='default'
                    value={this.state.fotoPerfil}
                />

                {this.state.name.length > 0 && this.state.email.length > 0 && this.state.password.length > 0 ? (
                    <TouchableOpacity
                        style={styles.button}
                        onPress={this.onSubmit}
                    >
                        <Text style={styles.textButton}>Registrarme</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={styles.buttonError}
                        onPress={() => this.setState({ textError: 'Debes completar los campos requeridos' })}
                    >
                        <Text style={styles.textButton}>Registrarme</Text>
                    </TouchableOpacity>
                )}

                {this.state.error ? <Text style={styles.textError}>{this.state.error}</Text> : null}
                {this.state.textError ? <Text style={styles.textError}>{this.state.textError}</Text> : null}

                <TouchableOpacity onPress={this.redirect.bind(this)}>
                    <Text style={styles.register}>¿Ya tienes una cuenta? Inicia sesión</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    button: {
        backgroundColor: '#007BFF',
        paddingVertical: 10,
        alignItems: 'center',
    },
    buttonError: {
        backgroundColor: '#FF0000',
        paddingVertical: 10,
        alignItems: 'center',
    },
    textButton: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    textError: {
        color: 'red',
        marginTop: 10,
        textAlign: 'center',
    },
    register: {
        marginTop: 20,
        textAlign: 'center',
        color: '#007BFF',
    },
});

export default Register;
