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

      message.authorId = rootState.auth.authId
      message.channelId = rootState.channels.activeItem._id

      // Add a new document with an auto-generated id.
      messagesRef
        .add(message)
        .then(() => resolve())
        .catch(error => reject(error))
    })
  },

  createPrivateMessage({ rootState }, message) {
    return new Promise((resolve, reject) => {
      const messagesRef = firestoreDB.collection('privateMessages')
      const userIds = rootState.channels.activeItem._id.split('/')

      message.authorId = rootState.auth.authId
      message.channelId = rootState.channels.activeItem._id

      // Add a new document with an auto-generated id.
      messagesRef
        .doc(rootState.auth.authId)
        .collection(userIds[1])
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
            const message = change.doc.data()
            const currentChannelId = rootState.channels.activeItem._id

            if (message.channelId === currentChannelId) {
              commit(
                'SET_ITEM',
                { resource: 'messages', id: change.doc.id, item: message },
                { root: true }
              )
            }
          }
        })

        resolve()
      })
    })
  },

  fetchPrivateMessages({ rootState, commit }) {
    const userIds = rootState.channels.activeItem._id.split('/')

    return new Promise(resolve => {
      firestoreDB
        .collection('privateMessages')
        .doc(rootState.auth.authId)
        .collection(userIds[1])
        .onSnapshot(snapshot => {
          // The forEach method 是同步操作
          snapshot.docChanges().forEach(change => {
            if (change.type == 'added') {
              const message = change.doc.data()
              const currentChannelId = rootState.channels.activeItem._id

              if (message.channelId === currentChannelId) {
                commit(
                  'SET_ITEM',
                  { resource: 'messages', id: change.doc.id, item: message },
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
