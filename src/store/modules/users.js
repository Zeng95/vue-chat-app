import { database } from '@/firebase.config'

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
      const usersRef = database.collection('users')

      usersRef
        .doc(userId)
        .set({
          username: user.given_name,
          name: user.name,
          avatar: user.picture
        })
        .then(() => {
          commit('SET_USERNAME', user.given_name)
          commit('SET_NAME', user.name)
          commit('SET_AVATAR', user.photoURL)

          resolve()
        })
        .catch(error => reject(error))
    })
  },

  // eslint-disable-next-line no-unused-vars
  updateUser({ state }, { userId, user }) {
    return new Promise((resolve, reject) => {
      const usersRef = database.collection('users')

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

  fetchUser({ commit }, userId) {
    return new Promise((resolve, reject) => {
      const usersRef = database.collection('users')

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

  fetchUsers({ dispatch }, { ids }) {
    return dispatch('fetchItems', { resource: 'users', ids }, { root: true })
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
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
