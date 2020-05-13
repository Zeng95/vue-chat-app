// initial state
const state = () => ({
  name: null
})

// getters
const getters = {
  currentUser: state => {
    return state.name
  }
}

// actions
const actions = {
  createUser({ commit }, user) {
    return new Promise(resolve => {
      commit('SET_NAME', user.displayName)
      resolve()
    })
  }
}

// mutations
const mutations = {
  SET_NAME(state, name) {
    state.name = name
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
