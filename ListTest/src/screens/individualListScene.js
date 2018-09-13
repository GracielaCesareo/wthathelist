import React, { Component } from 'react';
import { StatusBar } from 'react-native';
import {
    Container,
    Content,
    List,
    ListItem,
    Icon,
    Left,
    Right,
    Text,
    Fab,
    Spinner,
    CheckBox,
    Button
} from 'native-base';
import firebase from 'firebase'
import Toast from 'react-native-easy-toast'

export default class IndividualList extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: `${navigation.state.params.newItem.name}`,
        headerStyle: {
            backgroundColor: '#54d3b6'
        },
        headerTintColor: 'white'
    });
    constructor(props) {
        super(props)
        var user = firebase.auth().currentUser
        this.state = {
            loading: true,
            newListItem: '',
            items: [],
            user: user
        };
    }
    updateName(text) {
        this.setState({ newListItem: text });
        console.log(newListItem)
    }
    listenForItems() {
        firebase.database().ref().child("/listItems/").on('value', (snapshot) => {
            var items = [];
            snapshot.forEach((child) => {
                if (child.val().listRef === this.props.navigation.state.params.newItem.key) {
                    items.push({
                        name: child.val().name,
                        checked: child.val().checked,
                        // itemFor: child.val().itemFor,
                        key: child.key
                    });
                }
            });

            this.setState({
                loading: false,
                items: items
            });

        });
    }
    componentDidMount() {
        this.listenForItems();
        
    }
    updateCheckBox(key, checked) {
        firebase.database().ref().child("/listItems/" + key).update({
            checked: !checked
        });
    }
    addListItem() {
        this.props.navigation.navigate('NewListItem', { newItemKey: this.props.navigation.state.params.newItem.key })
    }
    removeItem(key) {
        firebase.database().ref().child("/listItems/" + key).remove();
        this.refs.success.show('Elemento eliminado!', 1500);
    }

    inviteUser() {
        this.props.navigation.navigate('InviteScreen', { newItemKey: this.props.navigation.state.params.newItem.key, newItemName: this.props.navigation.state.params.newItem.name});
        
        console.log ("This is the key from list" + this.props.navigation.state.params.newItem.key)
        console.log ("My name is " + this.props.navigation.state.params.newItem.name )
    }
    render() {
        if (this.state.loading) {
            return (
                <Container>
                    <StatusBar
                        backgroundColor="#3F51B5"
                        barStyle="light-content"
                    />
                    <Spinner color='#ffae44' style={{ flex: 1, justifyContent: 'center' }} />
                </Container>
            );
        } else {
            return (
                <Container>
                    <StatusBar
                        backgroundColor="#3F51B5"
                        barStyle="light-content"
                    />
                    <Content>
                        <List dataArray={this.state.items}
                            renderRow={(item) =>
                                <ListItem>
                                    <Left >
                                        <CheckBox 
                                        checked={item.checked} 
                                        onPress={() => this.updateCheckBox(item.key, item.checked)}
                                         />
                                        {/* <Text style={{ marginLeft: 15 }}>{item.name} - {item.itemFor}</Text> */}
                                        <Text style={{ marginLeft: 15 }}>{item.name}</Text>
                                    </Left>
                                    <Right>
                                        <Icon style={{ color: 'red' }} name="ios-remove-circle" onPress={() => this.removeItem(item.key)} />
                                    </Right>
                                </ListItem>
                            }>
                        </List>
                        {/* <Content style={{
                            padding: 20
                        }}> */}
                            <Button block rounded
                                style={{
                                    backgroundColor: '#ffae44',
                                }}
                                onPress={() => this.inviteUser()}>
                                    {/* <Icon name="md-add" /> */}
                                    <Text>Agregar invitado</Text>
                            </Button>
                        {/* </Content> */}
                        
                    </Content>
                    <Fab
                        style={{ backgroundColor: '#ffae44' }}
                        containerStyle={{ marginRight: 10 }}
                        position="bottomRight"
                        onPress={() => this.addListItem()} >
                        <Icon name="md-add" />
                    </Fab>
                    
                    
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