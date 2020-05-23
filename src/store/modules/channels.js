import { firestoreDB } from '@/firebase.config'

// initial state
const state = () => {
  return {
    id: null,
    name: null,

    items: {}
  }
}

// getters
const getters = {
  currentChannel: state => {
    return { id: state.id, name: state.name }
  }
}

// actions
const actions = {
  setCurrentChannel({ commit }, channel) {
    commit('SET_ID', channel._id)
    commit('SET_NAME', channel.name)
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

        resolve(channelsArray)
      })
    })
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
