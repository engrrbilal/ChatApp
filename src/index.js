import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import * as firebase from 'firebase'

import registerServiceWorker from './registerServiceWorker';
const config = {
    apiKey: "AIzaSyDBSpJdJjvwO0Gim1tDCLbrh_93AzjiNnY",
    authDomain: "chat-app-45503.firebaseapp.com",
    databaseURL: "https://chat-app-45503.firebaseio.com",
    projectId: "chat-app-45503",
    storageBucket: "chat-app-45503.appspot.com",
    messagingSenderId: "602508866705"
  };
  firebase.initializeApp(config);
ReactDOM.render(<MuiThemeProvider><App /></MuiThemeProvider>, document.getElementById('root'));
registerServiceWorker();
