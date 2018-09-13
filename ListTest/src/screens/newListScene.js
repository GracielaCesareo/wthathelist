import React, { Component } from 'react';
import { View, StatusBar, TouchableOpacity, Text, TextInput } from 'react-native';
import { Body, Button, Container, Content, Icon } from 'native-base';
import firebase from 'firebase'
import Toast from 'react-native-easy-toast'

export default class NewList extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Agregar nueva lista',
        headerStyle: {
            backgroundColor: '#54d3b6'
        },
        headerTintColor: 'white',
        headerRight:
        <View style={{ padding: 5 }}>
            <TouchableOpacity onPress={() => navigation.state.params.handleCreate()}>
                <Text style={{ color: 'white', padding: 5, fontWeight: 'bold' }}>crear lista</Text>
            </TouchableOpacity>
        </View>
    });
    constructor(props) {
        super(props);
        const currUser = [{
            name: firebase.auth().currentUser.displayName,
            key: firebase.auth().currentUser.uid
        }]
        this.state = {
            query: '',
            users: [],
            newListName: '',
            added: currUser,
            newPerson: ''
        }
    }
    updateName(text) {
        this.setState({ newListName: text });
    }
    componentDidMount() {
        firebase.database().ref().child("users").on('value', (snap) => {
            var lists = [];
            snap.forEach((child) => {
                lists.push({
                    name: child.val().name,
                    key: child.key
                });
            });
            this.setState({
                users: lists
            });
        });
        this.props.navigation.setParams({ handleCreate: this.createNewList.bind(this) });
    }

    createNewList() {
        if (String.prototype.trim.call(this.state.newListName) === '') {
            this.refs.error.show('Por favor ingrsa el nombre de la lista', 2000);
            return
        }

        if (this.state.added.length == 0) {
            this.refs.error.show(' ', 2000);
            return
        }
        firebase.database().ref().child("/lists").push({
            name: this.state.newListName,
            users: this.state.added
        });
        this.setState({
            newListName: '',
            // added: currUser
        });
        this.refs.success.show('¡Nueva lista creada!', 1500);
    }
    
    _filterData(query) {
        if (query === '') {
            return [];
        }
        const { users } = this.state;
        const regex = new RegExp(`${query.trim()}`, 'i');
        return users.filter(user => user.name.search(regex) >= 0);
    }
    render() {
        const { query } = this.state;
        const data = this._filterData(query)
        return (
            <Container>
                <StatusBar
                    backgroundColor="#3F51B5"
                    barStyle="light-content"
                />
                <Content padder>
                    <TextInput placeholder='Nombre de la lista'
                        value={this.state.newListName}
                        onChangeText={(text) => this.updateName(text)}
                        style={{
                            borderColor: 'gray',
                            borderRightWidth: 0,
                            borderLeftWidth: 0,
                            borderTopWidth: 0,
                            borderBottomWidth: 1
                        }} />

                </Content>
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
        )
    }
}