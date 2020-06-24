/* eslint-disable no-unused-vars */
import Vue from 'vue'
import gravatar from 'gravatar'
import { firestoreDB } from '@/firebase.config'

// initial state
const state = () => {
  return {
    items: {}, // store.state.users.items[id]
    sender: {},
    activeItem: {}
  }
}

// getters
const getters = {
  currentUser: state => {
    return state.activeItem
  },

  currentSender: state => {
    return state.sender
  }
}

// actions
const actions = {
  setSender({ commit }, sender) {
    commit('SET_CURRENT_SENDER', sender)
  },

  createUser({ commit }, { userId, user }) {
    return new Promise((resolve, reject) => {
      const usersRef = firestoreDB.collection('users')

      const { displayName, email, photoURL, username } = user
      const newUser = {
        username: displayName ? displayName.split(' ')[0] : username,
        name: displayName ? displayName : email,
        avatar: photoURL
          ? photoURL
          : gravatar.url(email, { d: 'identicon', protocol: 'https' })
      }

      usersRef
        .doc(userId)
        .set(newUser)
        .then(() => resolve())
        .catch(error => {
          console.log(error)
          reject(error)
        })
    })
  },

  updateUser({ state }, { userId, user }) {
    return new Promise((resolve, reject) => {
      const usersRef = firestoreDB.collection('users')

      const { displayName, email, photoURL } = user
      const newUser = {
        username: displayName ? displayName.split(' ')[0] : email,
        name: displayName,
        avatar: photoURL
      }

      usersRef
        .doc(userId)
        .update(newUser)
        .then(() => resolve())
        .catch(error => reject(error))
    })
  },

  updateUserStatus({ commit }, { userId, status }) {
    commit('SET_STATUS', { userId, status })
  },

  fetchUser({ commit }, userId) {
    return new Promise((resolve, reject) => {
      const usersRef = firestoreDB.collection('users')

      usersRef
        .doc(userId)
        .get()
        .then(doc => {
          if (doc.exists) {
            commit('SET_CURRENT_USER', doc.data())
            resolve()
          } else {
            resolve(null)
          }
        })
        .catch(error => reject(error))
    })
  },

  fetchUsers({ commit }) {
    return new Promise(resolve => {
      firestoreDB.collection('users').onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if (change.type == 'added') {
            const doc = change.doc
            const item = doc.data()

            commit(
              'SET_ITEM',
              { resource: 'users', id: doc.id, item },
              { root: true }
            )
          }
        })

        resolve()
      })
    })
  }
}

// mutations
const mutations = {
  SET_CURRENT_USER(state, user) {
    state.activeItem = user
  },

  SET_CURRENT_SENDER(state, sender) {
    state.sender = sender
  },

  SET_STATUS(state, { userId, status }) {
    Vue.set(state.items[userId], 'status', status)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
