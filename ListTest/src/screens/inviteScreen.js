import React, { Component } from 'react';
import { View, StatusBar, TouchableOpacity } from 'react-native';
import { Body, Button, Container, Content, Icon, Input, Picker, Text } from 'native-base';
import firebase from 'firebase'
import Toast from 'react-native-easy-toast'

export default class InviteScreen extends Component{
    static navigationOptions = ({navigation}) => ({
        title: "Invitaciones",
        headerStyle: {
            backgroundColor: '#54d3b6'
        },
        headerTintColor: 'white',
        
    });

    constructor(props) {
        super(props);
        const user = firebase.auth().currentUser.uid; 
        const mail = firebase.auth().currentUser.email;
    
        this.state = {
            user: user,
            guest: '',
            listKey: '',
            // list: '',
            listName: [],
            invitations_by_email: []
        }
    }

    componentWillMount() {
        this.invitationsListener();
    }

    componentDidMount() {
       
    }

    addGuest() {

        firebase.database().ref().child("/invitations").push({
            guest: this.state.guest,
            user: this.state.user,
            listKey: this.props.navigation.state.params.newItemKey,
            listName: this.props.navigation.state.params.newItemName
        });

        this.setState({
            guest: ''
        }) 
    }

    acceptInvitation(){

    }

    ignoreInvitation() {

    }

    invitationsListener(){
        const database = firebase.database()
        const tableRef = database.ref('/invitations')
        // const listKey = this.props.navigation.state.params.newItemKey
        const mail = firebase.auth().currentUser.email;
        console.log(mail);


        const emails = []

        tableRef.orderByChild("guest").equalTo(mail).on("child_added", (snapshot) => {
            let invitation = snapshot;
            emails.push( invitation );
            this.setState({
                invitations_by_email: emails
            });
            
      
          }, function(err){
            console.log('Retrieving failed: '+err);
          
        });
      
        
    }   

    render(){
        return(
            
            <Container>
                <Content padder >
                
                <View>
                {
                    this.state.invitations_by_email.map( (invitation,index) => {

                    let invitation_value = invitation.val();

                    return(
                        <View  key={index}
                            style={{
                                paddingTop: 10,
                                paddingBottom: 10
                            }}
                        >

                            <View >
                            <Text>Estás invitado a editar:</Text>
                            </View>

                            <View 
                            style={{
                                flexDirection: "row",
                                flex: 2,
                                alignItems: "center"
                            }}
                            >
                            <View>
                                <Text padder
                                style={{
                                    textAlign: "center",
                                    color: '#54d3b6',
                                    fontWeight: "bold"
                                
                                }}
                                >{ invitation_value.listName}</Text>
                            </View>
                            
                            <View 
                                style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    alignItems: "center",
                                    justifyContent:'flex-end'
                                }}
                            >
                                <Button rounded small
                                style={{
                                    backgroundColor: '#54d3b6',
                                    marginLeft: 5,
                                    marginRight: 5
                                }}
                                onPress={ ()=> this.acceptInvitation(invitation_value.listName) }><Text >Aceptar</Text></Button>
                            {/* </View>
                            <View
                                style={{
                                    flex: 1,
                                    alignItems: "center",
                                    justifyContent:'center'
                                }}
                            > */}
                                <Button rounded small
                                style={{
                                    backgroundColor: '#8f8f8f',
                                    marginLeft: 5,
                                    marginRight: 5
                                }}
                                 onPress={ ()=> this.ignoreInvitation(invitation_value.listName) }><Text>Ignorar</Text></Button>
                            </View>
                            </View>

                        </View>
                    )
                    })

                }
                </View>

                <View padder style={{ flexDirection: 'column' }}>
                    <Text>Invita a un amigo a editar tu lista</Text>
                    <Input placeholder='Correo de invitado'
                        value={this.state.guest}
                        onChangeText={(input) => this.setState({ guest: input })}
                        style={{
                            borderColor: 'gray',
                            borderRightWidth: 0,
                            borderLeftWidth: 0,
                            borderTopWidth: 0,
                            borderBottomWidth: 1,
                            marginBottom: 20
                        }}
                        underlineColorAndroid='rgba(0,0,0,0)'
                    />
                    <Button block rounded
                    style={{
                        backgroundColor: '#ffae44',
                    }}
                    onPress={() => this.addGuest()}>
                        {/* <Icon name="md-add" /> */}
                        <Text>Invitar</Text>
                    </Button>
                </View>
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