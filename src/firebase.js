import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

const config = {
  apiKey: 'AIzaSyDU-gH3qiowxcYOjberRn_YV3dSWI4xv18',
  authDomain: 'instagram-clone-yb.firebaseapp.com',
  projectId: 'instagram-clone-yb',
  storageBucket: 'instagram-clone-yb.appspot.com',
  messagingSenderId: '169870722501',
  appId: '1:169870722501:web:40a8410d4e1a4e05f7f7ac',
  measurementId: 'G-1KZM43VXMH'
};

const firebaseApp = !firebase.apps.length
  ? firebase.initializeApp(config)
  : firebase.app();

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
