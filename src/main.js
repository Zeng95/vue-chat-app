import '@babel/polyfill'
import 'mutationobserver-shim'
import * as firebase from 'firebase/app'

import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'

import '@/plugins/bootstrap-vue'
import '@/plugins/vue-chat-scroll'
import '@/plugins/vuelidate'

window.firebase = firebase

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
