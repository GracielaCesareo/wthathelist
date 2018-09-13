import React, { Component } from 'react';
import { ActivityIndicator, Image, Text, AsyncStorage, TextInput, View, StyleSheet, TouchableHighlight, StatusBar } from 'react-native'
import { Container } from 'native-base';
import firebase from "firebase";
import Toast from 'react-native-easy-toast';
// import { Fonts } from './src/utils/Fonts';

export default class Login extends Component {
    static navigationOptions = ({ navigation }) => ({
        header: null
    })

    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            password: '',
            loading: false
        }
    }

    render() {
        return (
            <Container style={{
                flex: 1,
                backgroundColor: '#fff',
                padding: 20
            }}>
                <StatusBar
                    backgroundColor="#fff"
                    barStyle="light-content"
                />
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Image style={{
                        height: 72,
                        width: 73
                    }} 
                    source={require('../images/wtl.png')}
                     />
                    {/* <Text style={{
                        textAlign: 'center',
                        color: '#FFF'
                    }}>Your weekly Grocery List</Text> */}
                </View>
                <View style={{ flex: 1, padding: 30 }}>
                    <TextInput style={{
                        padding: 8,
                        height: 40,
                        marginBottom: 20,
                        color: '#8d8d8d',
                        paddingHorizontal: 20,
                        paddingVertical: 0,
                        borderBottomWidth: 3,
                        borderBottomColor: '#54d3b6',
                        // fontFamily: Fonts.GothamRnd
                    }}
                        placeholder="Email"
                        placeholderTextColor='#8d8d8d'
                        underlineColorAndroid='rgba(0,0,0,0)'
                        keyboardType='email-address'
                        onSubmitEditing={() => this.password.focus()}
                        onChangeText={(input) => this.setState({ userName: input })}
                        value={this.state.userName} />
                    <TextInput style={{
                        padding: 8,
                        height: 40,
                        marginBottom: 20,
                        color: '#8d8d8d',
                        paddingHorizontal: 20,
                        paddingVertical: 0,
                        borderBottomWidth: 3,
                        borderBottomColor: '#54d3b6',
                        // fontFamily: Fonts.GothamRnd
                    }}
                        placeholder="Contraseña"
                        secureTextEntry
                        placeholderTextColor='#8d8d8d'
                        underlineColorAndroid='rgba(0,0,0,0)'
                        ref={(input) => this.password = input}
                        onChangeText={(input) => this.setState({ password: input })}
                        value={this.state.password} />
                    <TouchableHighlight onPress={this.login.bind(this)} style={{
                        backgroundColor: '#ffae44',
                        paddingVertical: 20,
                        width: '100%',
                        margin: 'auto',
                        borderRadius: 30
                    }} underlayColor='#99d9f4'>
                        <View>{this.loadingText()}</View>
                    </TouchableHighlight>
                    <View style={{
                        paddingTop: 5,
                        flexDirection: 'row',
                        justifyContent: 'center'
                    }}>
                        {/* <Text style={{ color: '#AAA', fontStyle: 'italic' }}>Not registered yet?    </Text> */}
                        <TouchableHighlight onPress={this.register.bind(this)} underlayColor='transparent'>
                            <Text style={{ color: '#54d3b6', fontWeight: 'bold' }}>no tengo cuenta</Text>
                        </TouchableHighlight>
                    </View>
                </View>
                <Toast
                    ref="error"
                    style={{ backgroundColor: 'red' }}
                    position='bottom'
                    positionValue={200}
                    fadeInDuration={750}
                    fadeOutDuration={1000}
                    opacity={0.8}
                />
                <Toast
                    ref="success"
                    style={{ backgroundColor: 'green' }}
                    position='bottom'
                    positionValue={200}
                    fadeInDuration={750}
                    fadeOutDuration={1000}
                    opacity={0.8}
                />
            </Container>
        );
    }
    loadingText() {
        if (this.state.loading) {
            return <ActivityIndicator size='small' color='white' />
        }
        else {
            return <Text style={{
                textAlign: 'center',
                color: '#FFF',
                fontWeight: 'bold'
            }}>Iniciar sesión</Text>
        }
    }
    validateEmail = (email) => {
        var regEx = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        return regEx.test(email);
    };
    login() {
        // Validation
        if (this.state.userName == "") {
            this.refs.error.show('User name cannot be blank.', 1500);
            return
        } else if (!this.validateEmail(this.state.userName)) {
            this.refs.error.show('User name is not in the required format', 1500);
            return
        } else if (this.state.password == "") {
            this.refs.error.show('Password cannot be blank', 1500);
            return
        }

        this.setState({ loading: true })
        firebase.auth().signInWithEmailAndPassword(this.state.userName, this.state.password).then((userData) => {
            AsyncStorage.setItem('userData', JSON.stringify(userData));
            this.setState({ loading: false })
            this.props.navigation.navigate('Lists', { passProps: this.props.navigation.state.params })
        }
        ).catch((error) => {
            this.refs.error.show('Login Failed. Please try again.', 1500);
            this.setState({ loading: false })
        });
    }

    register() {
        this.props.navigation.navigate('Register', { passProps: this.props.navigation.state.params })
    }
}

module.exports = Login;