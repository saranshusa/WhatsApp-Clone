import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCEIcaO4nyrzaqua9t1dp0uVXE62mXGlwk",
  authDomain: "whatsapp-8acf3.firebaseapp.com",
  projectId: "whatsapp-8acf3",
  storageBucket: "whatsapp-8acf3.appspot.com",
  messagingSenderId: "512604601231",
  appId: "1:512604601231:web:2fd19c1c35644b01bda9fa",
};

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };
