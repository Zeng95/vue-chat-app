// The core Firebase JS SDK is always required and must be listed first
import * as firebase from 'firebase/app'

import 'firebase/analytics'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/database'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID,
  measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig)
firebase.analytics()

const auth = firebase.auth()
const firestoreDB = firebase.firestore()
const realtimeDB = firebase.database()
const twitterProvider = new firebase.auth.TwitterAuthProvider()
const googleAuthProvider = new firebase.auth.GoogleAuthProvider()
const githubAuthProvider = new firebase.auth.GithubAuthProvider()

export {
  auth,
  twitterProvider,
  googleAuthProvider,
  githubAuthProvider,
  realtimeDB,
  firestoreDB
}
