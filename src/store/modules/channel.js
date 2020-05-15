// initial state
const state = () => ({
  id: null,
  name: null
})

// getters
const getters = {
  currentChannel: state => {
    return { id: state.id, name: state.name }
  }
}

// actions
const actions = {
  setCurrentChannel({ commit }, channel) {
    commit('SET_ID', channel.id)
    commit('SET_NAME', channel.name)
  }
}

// mutations
const mutations = {
  SET_ID(state, id) {
    state.id = id
  },

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
