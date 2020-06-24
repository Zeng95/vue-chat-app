/* eslint-disable no-unused-vars */
import { firestoreDB } from '@/firebase.config'

// initial state
const state = () => {
  return {
    items: {},
    activeItem: {},
    isPrivate: false
  }
}

// getters
const getters = {
  currentChannel: state => state.activeItem
}

// actions
const actions = {
  setPrivate({ commit }, isPrivate) {
    commit('SET_PRIVATE', isPrivate)
  },

  setCurrentChannel({ commit }, channel) {
    commit('SET_CURRENT_CHANNEL', channel)
  },

  createChannel({ state }, channelName) {
    return new Promise((resolve, reject) => {
      firestoreDB
        .collection('channels')
        .add({ name: channelName })
        .then(() => resolve())
        .catch(error => reject(error))
    })
  },

  fetchChannels({ state, commit, dispatch }) {
    return new Promise(resolve => {
      firestoreDB.collection('channels').onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if (change.type == 'added') {
            const doc = change.doc
            const item = doc.data()

            commit(
              'SET_ITEM',
              { resource: 'channels', id: doc.id, item },
              { root: true }
            )
          }
        })

        // Object to Array
        const channelsArray = Object.values(state.items)

        dispatch('setCurrentChannel', channelsArray[0])

        resolve()
      })
    })
  }
}

// mutations
const mutations = {
  SET_CURRENT_CHANNEL(state, channel) {
    state.activeItem = channel
  },

  SET_PRIVATE(state, isPrivate) {
    state.isPrivate = isPrivate
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
