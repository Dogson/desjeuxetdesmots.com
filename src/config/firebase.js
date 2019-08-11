import * as firebase from 'firebase';
import {FIREBASE_API} from "./apiConfig";

import "firebase/auth";
import "firebase/firestore";
// require('firebase-admin');


firebase.initializeApp(FIREBASE_API);
// Initialize Firebase

export default firebase;
