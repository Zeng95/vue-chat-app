/* eslint-disable no-unused-vars */
import { firestoreDB } from '@/firebase.config'

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
      const messagesRef = firestoreDB.collection('messages')

      message.userId = rootState.auth.authId
      message.channelId = rootState.channels.id

      // Add a new document with an auto-generated id.
      messagesRef
        .add(message)
        .then(() => resolve())
        .catch(error => reject(error))
    })
  },

  fetchMessages({ rootState, commit }) {
    return new Promise(resolve => {
      firestoreDB.collection('messages').onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if (change.type == 'added') {
            const doc = change.doc
            const item = doc.data()

            if (item.channelId === rootState.channels.id) {
              commit(
                'SET_ITEM',
                { resource: 'messages', id: doc.id, item },
                { root: true }
              )
            }
          }
        })

        resolve()
      })
    })
  },

  clearMessagesLocally({ commit }) {
    commit('SET_ITEMS', {})
  }
}

// mutations
const mutations = {
  SET_ITEMS: (state, items) => {
    state.items = items
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
