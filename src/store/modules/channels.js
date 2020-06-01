import { firestoreDB } from '@/firebase.config'

// initial state
const state = () => {
  return {
    items: {},
    activeItem: { id: null, name: null }
  }
}

// getters
const getters = {
  currentChannel: state => state.activeItem
}

// actions
const actions = {
  setCurrentChannel({ commit }, channel) {
    commit('SET_CURRENT_CHANNEL', { id: channel._id, name: channel.name })
  },

  // eslint-disable-next-line no-unused-vars
  createChannel({ state }, channel) {
    return new Promise((resolve, reject) => {
      firestoreDB
        .collection('channels')
        .add({ name: channel })
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
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
