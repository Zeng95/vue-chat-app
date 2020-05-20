import Vue from 'vue'
import Vuex from 'vuex'

// 全局属性
import actions from './actions'
import mutations from './mutations'

// 模块
import auth from './modules/auth'
import users from './modules/users'
import channels from './modules/channels'
import messages from './modules/messages'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  actions,
  mutations,
  modules: { auth, users, channels, messages },
  strict: debug
})
