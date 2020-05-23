import Vue from 'vue'
import { firestoreDB } from '@/firebase.config'

// initial state
const state = () => {
  return {
    name: null,
    username: null,
    avatar: null,

    items: {}
  }
}

// getters
const getters = {
  currentUser: state => {
    return {
      username: state.username,
      name: state.name,
      avatar: state.avatar
    }
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
          commit('SET_USERNAME', username)
          commit('SET_NAME', name)
          commit('SET_AVATAR', avatar)

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
            const user = doc.data()

            commit('SET_NAME', user.name)
            commit('SET_USERNAME', user.username)
            commit('SET_AVATAR', user.avatar)

            resolve(user)
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
  SET_USERNAME(state, username) {
    state.username = username
  },

  SET_NAME(state, name) {
    state.name = name
  },

  SET_AVATAR(state, avatar) {
    state.avatar = avatar
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
