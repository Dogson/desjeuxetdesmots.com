import * as firebase from 'firebase';
import {FIREBASE_API} from "./apiConfig";

require('firebase/firestore');


firebase.initializeApp(FIREBASE_API);
// Initialize Firebase

export default firebase;
