import * as firebase from 'firebase/app'
import 'firebase/auth'
import {
  database,
  twitterProvider,
  googleAuthProvider,
  githubAuthProvider
} from '@/firebase.config'

// initial state
const state = () => ({
  loggedIn: false
})

// getters
const getters = {
  loggedIn: state => {
    return state.loggedIn
  }
}

// actions
const actions = {
  // To sign in with a pop-up window.
  signInWithTwitter({ dispatch }) {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .signInWithPopup(twitterProvider)
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
  },

  signInWithGoogle({ dispatch }) {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .signInWithPopup(googleAuthProvider)
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
  },

  signInWithGithub({ dispatch }) {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .signInWithPopup(githubAuthProvider)
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
const mutations = {
  AUTH_SUCCESS: state => {
    state.loggedIn = true
  },

  AUTH_FAILURE: state => {
    state.loggedIn = false
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
