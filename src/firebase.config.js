// The core Firebase JS SDK is always required and must be listed first
import * as firebase from 'firebase/app'

import 'firebase/analytics'
import 'firebase/auth'
import 'firebase/firestore'

import store from '@/store'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAtswh1tuPPdQI-38R0uPeFxl23vZQMYPE',
  authDomain: 'vue-chat-app-eff2f.firebaseapp.com',
  databaseURL: 'https://vue-chat-app-eff2f.firebaseio.com',
  projectId: 'vue-chat-app-eff2f',
  storageBucket: 'vue-chat-app-eff2f.appspot.com',
  messagingSenderId: '363993316599',
  appId: '1:363993316599:web:e9912edb6f4436a55de7f2',
  measurementId: 'G-W10DZFX17K'
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)
firebase.analytics()

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    // dispatch user
    store.dispatch('user/fetchUser', user)
  }
})

const database = firebase.firestore()

// 第三方登录对象的实例
const twitterProvider = new firebase.auth.TwitterAuthProvider()
const googleAuthProvider = new firebase.auth.GoogleAuthProvider()
const githubAuthProvider = new firebase.auth.GithubAuthProvider()

export { database, twitterProvider, googleAuthProvider, githubAuthProvider }
