import firebase from 'firebase/app';

import 'firebase/auth';
import 'firebase/database';
import * as firebaseui from 'firebaseui';

firebase.initializeApp({
})

export const auth = firebase.auth();
export const firedb = firebase.database();
export const fireui = firebaseui;
export default firebase;
