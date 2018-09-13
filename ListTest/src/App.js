import React, { Component } from 'react';
// import { AppRegistry } from 'react-native';
import { StackNavigator } from 'react-navigation';
import ListScene from './screens/listScene';
import NewListScene from './screens/newListScene';
import LoginScene from './screens/loginScene';
import SplashScreen from './screens/splashScreen';
import IndividualListScene from './screens/individualListScene';
import NewListItemScene from './screens/newListItemScene';
import RegisterScene from './screens/registerScene';
import InviteScreen from './screens/inviteScreen';

console.disableYellowBox = true;

const App = StackNavigator({
    Splash: { screen: SplashScreen },
    Login: { screen: LoginScene },
    Register: { screen: RegisterScene },
    Lists: { screen: ListScene },
    NewList: { screen: NewListScene },
    IndividualList: { screen: IndividualListScene },
    NewListItem: { screen: NewListItemScene },
    InviteScreen: {screen: InviteScreen},
}, {
        cardStyle: { backgroundColor: 'white' }
    });

export default App;