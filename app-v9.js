import logo from './logo.svg';
import './App.css';
import React, { useEffect } from 'react';
import {initializeApp} from 'firebase/app'
import{getAuth, signOut, onAuthStateChanged, signInWithCredential, signInAnonymously, GoogleAuthProvider,EmailAuthProvider} from'firebase/auth';
import * as firebaseui from 'firebaseui';

function App() {
let firebaseAuth;

  useEffect(() => {
    initializeApp({
    });

    firebaseAuth = getAuth();
    const uiConfig = {
      signInSuccessUrl: 'http://localhost:3000/',
      autoUpgradeAnonymousUsers: true,
      signInFlow: 'popup',
      signInOptions: [
        GoogleAuthProvider.PROVIDER_ID,
        EmailAuthProvider.PROVIDER_ID
      ],
      callbacks: {
        signInFailure: function (error) {
          // Temp variable to hold the anonymous user data if needed.
          let data = null;
          // Hold a reference to the anonymous current user.
          let anonymousUser = firebaseAuth.currentUser;
          // For merge conflicts, the error.code will be
          // 'firebaseui/anonymous-upgrade-merge-conflict'.
          if (error.code != 'firebaseui/anonymous-upgrade-merge-conflict') {
            return Promise.resolve();
          }
          console.log('v9: ',"I'm here.")
          // The credential the user tried to sign in with.
          var cred = error.credential;
          // Copy data from anonymous user to permanent user and delete anonymous
          // user.
          // ...
          // Finish sign-in after data is copied.
          return signInWithCredential(firebaseAuth, cred)
          .then(anonymousUser.delete())
        }
      }
    };

    if (firebaseui.auth.AuthUI.getInstance()) {
      const ui = firebaseui.auth.AuthUI.getInstance()
      ui.start('#firebaseui-auth-container', uiConfig)
    }
    else {
      const ui = new firebaseui.auth.AuthUI(firebaseAuth)
      ui.start('#firebaseui-auth-container', uiConfig)
    }



    onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        console.log(user.uid);
      }
      else {
        console.log('User is signed out')
      }
    })
  }, []);

  const goSignInAnonymously = async (e) => {
    signInAnonymously(firebaseAuth);
  }

  const signOutGoogle = async (e) => {
    signOut(firebaseAuth);
  }

  return (
    <div >
      <div id='firebaseui-auth-container'>

      </div>
      <button onClick={goSignInAnonymously}>Sign-In Anonymously</button>
      <button onClick={signOutGoogle}>Sign out</button>
    </div>

  );
}

export default App;
