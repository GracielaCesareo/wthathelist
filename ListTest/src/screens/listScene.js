import React, { Component } from 'react';
import { AsyncStorage, StatusBar, View } from 'react-native';
import {
    Container,
    Header,
    Title,
    Content,
    List,
    ListItem,
    Button,
    Left,
    Right,
    Body,
    Icon,
    Text,
    Fab,
    Footer,
    InputGroup,
    Input,
    Spinner,
    TouchableHighlight
} from 'native-base';
import firebase from 'firebase'
import { NavigationActions } from 'react-navigation';
import Swipeout from 'react-native-swipeout';
import Toast from 'react-native-easy-toast'

export default class Lists extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'mis listas',
        headerLeft: null,
        headerStyle: {
            // backgroundColor: '#3F51B5'
            backgroundColor: '#54d3b6'
        },
        headerTintColor: 'white',
        headerRight: <Button transparent onPress={() => {
            AsyncStorage.setItem('userData', '');
            navigation.navigate('Login');
        }
        }><Icon name='md-log-out' style={{ color: 'white' }} /></Button>
    })
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            newListName: '',
            list: []
        };
        console.log("AAAA" +props.navigation.state.params)
    }
    updateName(text) {
        this.setState({ newListName: text });
    }
    listenForLists() {
        firebase.database().ref().child("lists").on('value', (snap) => {
            var lists = [];
            snap.forEach((child) => {
                var users = child.val().users;
                users.map(function (user) {
                    if (user.key === firebase.auth().currentUser.uid) {
                        lists.push({
                            name: child.val().name,
                            key: child.key
                        });
                    }
                });
            });
            this.setState({
                loading: false,
                list: lists
            });
        });
    }
    componentDidMount() {
        this.listenForLists();
    }
    createNewList() {
        if (this.state.newListName === '') {
            this.refs.error.show('Por favor nombra la lista', 2000);
            return
        }
        if (String.prototype.trim.call(this.state.newListName) !== "") {
            firebase.database().ref().child("/lists").push({
                name: this.state.newListName
            });
            this.setState({ newListName: '' });
            this.refs.success.show('¡Nueva lista creada!', 1500);
        }
    }
    listDelete(key) {
        firebase.database().ref().child("/lists/" + key).remove();
        this.refs.success.show('¡Se ha borrado la lista!', 1500);
    }
    listDetails(listName) {
        this.props.navigation.navigate('IndividualList', { newItem: listName })
    }
    addList() {
        this.props.navigation.navigate('NewList')
    }
    render() {
        if (this.state.loading) {
            return (
                <Container>
                    <StatusBar
                        backgroundColor="#3F51B5"
                        barStyle="light-content"
                    />
                    <Content>
                        <Spinner style={{ flex: 1, justifyContent: 'center' }} />
                    </Content>
                </Container>
            );
        } else {
            var content = <View>
                <Text style={{ textAlign: 'center', color: 'grey', paddingTop: 20 }}>
                    No lists created.
                            </Text>
            </View>
            if (this.state.list.length > 0) {
                content = <List dataArray={this.state.list}
                    renderRow={(item) =>
                        <Swipeout right={[{
                            text: 'Delete',
                            backgroundColor: '#54d3b6',
                            underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
                            onPress: () => { this.listDelete(item.key) }
                        }]}
                            autoClose={true}
                            backgroundColor='transparent'>
                            <ListItem onPress={() => this.listDetails(item)}>
                                <Text>{item.name}</Text>
                                <Right>
                                    <Icon name="ios-arrow-forward" style={{ color: 'black' }} />
                                </Right>
                            </ListItem>
                        </Swipeout>
                    }>
                </List>
            }
            return (
                <Container>
                    <StatusBar
                        backgroundColor="#3F51B5"
                        barStyle="light-content"
                    />
                    <Content>
                        {content}
                    </Content>

                    <Fab
                        style={{ backgroundColor: '#ffae44', width: '100%' }}
                        containerStyle={{ marginRight: 10 }}
                        position="bottomRight"
                        onPress={() => this.addList()} >
                        {/* <Icon name="md-add" /> */}
                         <Text>ADD</Text>
                    </Fab>
                    
                    {/* <TouchableHighlight onPress={() => this.addList()} style={{
                        backgroundColor: '#ffae44',
                        paddingVertical: 20,
                        width: '100%',
                        margin: 'auto',
                        borderRadius: 30
                    }} underlayColor='#99d9f4'>
                        <Text>add</Text>
                    </TouchableHighlight> */}


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
    }
}