import * as firebase from 'firebase/app'
import 'firebase/auth'
import { database, GoogleAuthProvider } from '@/firebase.config'

// initial state
const state = () => ({})

// getters
const getters = {}

// actions
const actions = {
  // To sign in with a pop-up window.
  signInWithGoogle({ dispatch }) {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .signInWithPopup(GoogleAuthProvider)
        .then(result => {
          const usersRef = database.collection('users')

          usersRef
            .doc(result.user.uid)
            .get()
            .then(docSnapshot => {
              // If the user does not exist then create
              if (!docSnapshot.exists) {
                dispatch('user/createUser', result.user, {
                  root: true
                }).then(() => {
                  resolve(result.user)
                })
              } else {
                resolve(result.user)
              }
            })
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}

// mutations
const mutations = {}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
