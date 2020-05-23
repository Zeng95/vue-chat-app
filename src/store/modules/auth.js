import {
  auth,
  twitterProvider,
  googleAuthProvider,
  githubAuthProvider,
  realtimeDB,
  firestoreDB
} from '@/firebase.config'

// initial state
const state = () => ({
  authId: null
})

// actions
const actions = {
  initAuthentication({ dispatch }) {
    return new Promise((resolve, reject) => {
      auth.onAuthStateChanged(async result => {
        if (result) {
          // 如果 user 存在，说明用户已经处于登录状态
          const userId = result.uid
          const user = result.providerData[0]

          dispatch('listenForConnection')

          try {
            await dispatch('users/updateUser', { userId, user }, { root: true })
            const result = await dispatch('fetchAuthUser')

            resolve(result)
          } catch (error) {
            reject(error)
          }
        } else {
          resolve(null)
        }
      })
    })
  },

  fetchAuthUser({ dispatch, commit }) {
    return new Promise((resolve, reject) => {
      const userId = auth.currentUser.uid

      dispatch('users/fetchUser', userId, { root: true })
        .then(user => {
          commit('SET_AUTH_USER', userId)
          resolve(user)
        })
        .catch(error => reject(error))
    })
  },

  // 使用 Email 登录
  signInWithEmail() {},

  // 使用 Twitter 账号登录
  signInWithTwitter({ dispatch }) {
    return dispatch('signInWithPopup', twitterProvider)
  },

  // 使用 Google 账号登录
  signInWithGoogle({ dispatch }) {
    return dispatch('signInWithPopup', googleAuthProvider)
  },

  // 使用 Github 账号登录
  signInWithGithub({ dispatch }) {
    return dispatch('signInWithPopup', githubAuthProvider)
  },

  // 弹窗登录
  signInWithPopup({ dispatch }, provider) {
    return new Promise((resolve, reject) => {
      auth
        .signInWithPopup(provider)
        .then(result => {
          const usersRef = firestoreDB.collection('users')

          const user = result.user
          const userId = result.user.uid

          usersRef
            .doc(userId)
            .get()
            .then(doc => {
              if (!doc.exists) {
                // If the user does not exist then create
                dispatch('users/createUser', { userId, user }, { root: true })
                  .then(() => resolve())
                  .catch(error => reject(error))
              } else {
                resolve()
              }
            })
        })
        .catch(error => reject(error))
    })
  },

  // 退出登录
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      auth
        .signOut()
        .then(() => {
          commit('SET_AUTH_USER', null)
          resolve()
        })
        .catch(error => reject(error))
    })
  },

  listenForConnection({ dispatch }) {
    const connectedRef = realtimeDB.ref('.info/connected')

    connectedRef.on('value', async () => {
      await dispatch('disconnect')
      await dispatch('setOnlineStatus')
    })
  },

  setOnlineStatus() {
    const userId = auth.currentUser.uid
    const userStatusDatabaseRef = realtimeDB.ref(`/status/${userId}`)

    const isOnlineForDatabase = {
      state: 'online',
      last_changed: window.firebase.database.ServerValue.TIMESTAMP
    }

    userStatusDatabaseRef.set(isOnlineForDatabase)
  },

  setOfflineStatus() {
    const userId = auth.currentUser.uid
    const userStatusDatabaseRef = realtimeDB.ref(`/status/${userId}`)

    const isOfflineForDatabase = {
      state: 'offline',
      last_changed: window.firebase.database.ServerValue.TIMESTAMP
    }

    userStatusDatabaseRef.set(isOfflineForDatabase)
  },

  disconnect() {
    return new Promise(resolve => {
      const userId = auth.currentUser.uid
      const userStatusDatabaseRef = realtimeDB.ref(`/status/${userId}`)

      const isOfflineForDatabase = {
        state: 'offline',
        last_changed: window.firebase.database.ServerValue.TIMESTAMP
      }

      userStatusDatabaseRef
        .onDisconnect()
        .set(isOfflineForDatabase)
        .then(() => resolve())
    })
  }
}

// mutations
const mutations = {
  SET_AUTH_USER: (state, id) => {
    state.authId = id
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
