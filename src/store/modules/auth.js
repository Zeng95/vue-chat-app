import * as firebase from 'firebase/app'
import 'firebase/auth'
import { GoogleAuthProvider } from '@/firebase.config'

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
          // Dispatch root actions
          dispatch('user/createUser', result.user, { root: true }).then(() => {
            resolve(result)
          })
        })
        .catch(error => {
          // Handle Errors here.
          const errorMessage = error.message

          reject(errorMessage)
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
