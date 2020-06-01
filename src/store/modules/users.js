import Vue from 'vue'
import { firestoreDB } from '@/firebase.config'

// initial state
const state = () => {
  return {
    items: {},
    activeItem: { username: null, name: null, avatar: null }
  }
}

// getters
const getters = {
  currentUser: state => {
    return state.activeItem
  }
}

// actions
const actions = {
  createUser({ commit }, { userId, user }) {
    return new Promise((resolve, reject) => {
      const usersRef = firestoreDB.collection('users')

      const username = user.displayName.split(' ')[0]
      const name = user.displayName
      const avatar = user.photoURL

      usersRef
        .doc(userId)
        .set({ username, name, avatar })
        .then(() => {
          commit('SET_CURRENT_USER', { username, name, avatar })
          resolve()
        })
        .catch(error => reject(error))
    })
  },

  // eslint-disable-next-line no-unused-vars
  updateUser({ state }, { userId, user }) {
    return new Promise((resolve, reject) => {
      const usersRef = firestoreDB.collection('users')

      const username = user.displayName.split(' ')[0]
      const name = user.displayName
      const avatar = user.photoURL

      usersRef
        .doc(userId)
        .update({ username, name, avatar })
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
    state.activeItem.username = user.username
    state.activeItem.name = user.name
    state.activeItem.avatar = user.avatar
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
