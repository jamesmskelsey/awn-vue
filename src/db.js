import firebase from 'firebase/app'
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyCkXh3kcMJYHUGGAEgKNiqQqE9Lj7vGvY0",
    authDomain: "essex-awn.firebaseapp.com",
    databaseURL: "https://essex-awn.firebaseio.com",
    projectId: "essex-awn",
    storageBucket: "essex-awn.appspot.com",
    messagingSenderId: "775166663435",
    appId: "1:775166663435:web:0975503b09d9a311a3e00e"
  };

export const db = firebase
    .initializeApp(firebaseConfig)
    .firestore();