import firebase from 'firebase'

const config = {
    apiKey: 'AIzaSyD3LnfIJ8Aqr0iBt286YUpuTDJApLykDcA',
    authDomain: 'shoppinglist-d49dc.firebaseapp.com',
    databaseURL: 'https://shoppinglist-d49dc.firebaseio.com',
    projectId: 'shoppinglist-d49dc',
    storageBucket: 'shoppinglist-d49dc.appspot.com',
    messagingSenderId: '227003299903'
};

export default class Settings {
    constructor() {
        firebase.initializeApp(config)
        this.splashTime = 2000
    }

    get SplashTime() {
        return this.splashTime
    }
}