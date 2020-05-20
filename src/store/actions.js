import { database } from '@/firebase.config'

export default {
  fetchItem: ({ state, commit }, { resource, id }) => {
    console.log(id)
    return new Promise((resolve, reject) => {
      database
        .collection(resource)
        .doc(id)
        .get()
        .then(doc => {
          if (doc.exists) {
            commit('SET_ITEM', { resource, id: doc.id, item: doc.data() })
            resolve(state[resource]['items'][id])
          } else {
            resolve(null)
          }
        })
        .catch(error => reject(error))
    })
  },

  // Each fetchItem call retuens a promise.
  fetchItems: ({ dispatch }, { resource, ids }) => {
    ids = Object.values(ids)

    return Promise.all(
      ids.map(id => dispatch('fetchItem', { resource, id }, { root: true }))
    )
  }
}
