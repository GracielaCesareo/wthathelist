import React, { Component } from 'react'
import { Image, StyleSheet, Text, AsyncStorage, StatusBar } from 'react-native'
import { View, Spinner } from 'native-base'
import { StackActions, NavigationActions } from 'react-navigation'

//Settings
import Settings from '../settings'

const settings = new Settings()

export default class SplashScreen extends Component {
    static navigationOptions = ({ navigation }) => ({
        header: null
    })
    constructor(props) {
        super(props)
        this.state = {
            store: {
                settings: settings,
            },
            action: 'Login',
        }
        AsyncStorage.getItem('userData', (err, result) => {
            if (result != null) {
                this.setState({ action: 'Lists' })
            }
            this.queso()
        });
    }
    queso() {
        const resetAction = StackActions.reset({
            index: 0,
            key: null,
            actions: [
                NavigationActions.navigate({ routeName: this.state.action, returning: true })
            ]
        })
        setTimeout(() => {
            this.props.navigation.dispatch(resetAction)
        }, this.state.store.settings.SplashTime)
    }
    render() {
        return (
            <View style={{
                flex: 1,
                // backgroundColor: '#3F51B5',
                backgroundColor: '#fff'
                // padding: 20
            }}>
                <StatusBar
                    // backgroundColor="#3F51B5"
                    backgroundColor = "#fff"
                    barStyle="light-content"
                />
                <View style={{
                    flex: 1,
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                }}>
                    <Image style={{
                        height: 283,
                        width: '100%',
                        paddingBottom: 20
                    }} 
                    source={require('../images/bg.png')}
                     />
                    <Image style={{
                        height: 100,
                        width: 100,
                        marginBottom: 20
                    }} 
                    source={require('../images/wtl.png')}
                     />
                     <Image style={{
                        height: 24,
                        width: 189
                    }} 
                    source={require('../images/logo.png')}
                     />
                     
                    {/* <Text style={{
                        textAlign: 'center',
                        color: '#FFF'
                    }}>Your weekly Grocery List</Text> */}
                    <Spinner color='#54d3b6' />
                </View>
            </View>
        )
    }
}