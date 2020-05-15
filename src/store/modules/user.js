import { database } from '@/firebase.config'

// initial state
const state = () => ({
  name: null,
  avatar: null
})

// getters
const getters = {
  currentUser: state => {
    return { name: state.name, avatar: state.avatar }
  }
}

// actions
const actions = {
  fetchUser({ commit }, user) {
    console.log(user)
    commit('auth/AUTH_SUCCESS', null, { root: true })

    commit('SET_NAME', user.displayName)
    commit('SET_AVATAR', user.photoURL)
  },

  createUser({ commit }, user) {
    return new Promise(resolve => {
      const usersRef = database.collection('users')

      usersRef.doc(user.uid).set({
        email: user.email,
        avatar: user.photoURL,
        name: user.displayName
      })

      commit('SET_NAME', user.displayName)
      commit('SET_AVATAR', user.photoURL)

      resolve()
    })
  }
}

// mutations
const mutations = {
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
