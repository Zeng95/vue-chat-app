/* eslint-disable no-unused-vars */
import { database } from '@/firebase.config'

// initial state
const state = () => {
  return {
    items: {}
  }
}

// actions
const actions = {
  createMessage({ rootState }, message) {
    return new Promise((resolve, reject) => {
      const usersRef = database.collection('users')
      const messagesRef = database.collection('messages')
      const channelsRef = database.collection('channels')

      message.userId = rootState.auth.authId
      message.channelId = rootState.channels.id

      // 首先在 messages collection 中新增 message document。
      // 然后根据自动生成的 messageId 分别在 channels 和 users collection 中创建 subcollection。
      // Add a new document with an auto-generated id.
      messagesRef
        .add(message)
        .then(async docRef => {
          const doc = await channelsRef.doc(rootState.channels.id).get()

          if (!doc.data().messages) {
            const messages = {}
            messages[docRef.id] = docRef.id

            await channelsRef.doc(rootState.channels.id).update({ messages })
          } else {
            const messages = doc.data().messages
            messages[docRef.id] = docRef.id
            console.log(messages)
            await channelsRef.doc(rootState.channels.id).update({ messages })
          }

          resolve()
        })
        .catch(error => reject(error))
    })
  },

  fetchMessages({ dispatch }, { ids }) {
    return dispatch('fetchItems', { resource: 'messages', ids }, { root: true })
  }
}

// mutations
const mutations = {}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
