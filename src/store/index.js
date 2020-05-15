import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import channel from './modules/channel'
import user from './modules/user'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

// initial state
const state = () => ({
  error: null
})

// getters
const getters = {}

// actions
const actions = {}

// mutations
const mutations = {}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  modules: { auth, user, channel },
  strict: debug
})
