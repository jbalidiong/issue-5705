import logo from './logo.svg';
import './App.css';
import { auth, firedb, fireui } from './firebase';
import firebase from "firebase";
import React, { useEffect } from 'react';
function App() {
  useEffect(() => {

    const uiConfig = {
      signInSuccessUrl: 'http://localhost:port_number/',
      autoUpgradeAnonymousUsers: true,
      signInFlow: 'popup',
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ],
      callbacks: {
        signInFailure: function (error) {
          // Temp variable to hold the anonymous user data if needed.
          let data = null;
          // Hold a reference to the anonymous current user.
          let anonymousUser = firebase.auth().currentUser;
          // For merge conflicts, the error.code will be
          // 'firebaseui/anonymous-upgrade-merge-conflict'.
          if (error.code != 'firebaseui/anonymous-upgrade-merge-conflict') {
            return Promise.resolve();
          }
          console.log("I'm here.")
          // The credential the user tried to sign in with.
          var cred = error.credential;
          // Copy data from anonymous user to permanent user and delete anonymous
          // user.
          // ...
          // Finish sign-in after data is copied.
          return firebase
            .auth()
            .signInWithCredential(cred)
            .then(anonymousUser.delete())
        }
      }
    };
    if (fireui.auth.AuthUI.getInstance()) {
      const ui = fireui.auth.AuthUI.getInstance()
      ui.start('#firebaseui-auth-container', uiConfig)
    }
    else {
      const ui = new fireui.auth.AuthUI(firebase.auth())
      ui.start('#firebaseui-auth-container', uiConfig)
    }



    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log(user.uid);
      }
      else {
        console.log('User is signed out')
      }
    })
  }, [])

  const signInAnonymously = async (e) => {
    auth.signInAnonymously();
  }

  const signOutGoogle = async (e) => {
    auth.signOut();
  }

  return (
    <div className="App">
      <div id='firebaseui-auth-container'>

      </div>
      <button onClick={signInAnonymously}>Sign-In Anonymously</button>
      <button onClick={signOutGoogle}>Sign out</button>

    </div>
  );
}

export default App;
