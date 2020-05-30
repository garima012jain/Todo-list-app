import firebase from '@firebase/app';
import '@firebase/firestore'


var firebaseConfig = {
    apiKey: "AIzaSyC2oZNBdt46gKpIoFBM--JGT0_HtmLsZc8",
    authDomain: "todolist-d3f34.firebaseapp.com",
    databaseURL: "https://todolist-d3f34.firebaseio.com",
    projectId: "todolist-d3f34",
    storageBucket: "todolist-d3f34.appspot.com",
    messagingSenderId: "1043392272339",
    appId: "1:1043392272339:web:95a5ac85108bc1f7340126",
    measurementId: "G-FJYFT8EBLK"
};
//Initialize Firebase
//firebase.initializeApp(firebaseConfig);
const firebaseApp = firebase.initializeApp(firebaseConfig);
export default firebaseApp.firestore()