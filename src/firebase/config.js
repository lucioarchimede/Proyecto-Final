import app from "firebase/app"
import firebase from "firebase";


const firebaseConfig = {
    apiKey: "AIzaSyC8qmS70W-Xlt8um9rCpZxDUCtL7mNXxGI",
    authDomain: "primer-firebase-df8ad.firebaseapp.com",
    projectId: "primer-firebase-df8ad",
    storageBucket: "primer-firebase-df8ad.appspot.com",
    messagingSenderId: "327253498780",
    appId: "1:327253498780:web:a8053fef77d68520950659"
  };

  app.initializeApp(firebaseConfig)

  export const auth = firebase.auth();
  export const db = app.firestore();
  export const storage= app.storage();

