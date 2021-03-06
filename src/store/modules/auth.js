/* eslint-disable no-unused-vars */
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
        // 如果 result 存在，说明用户已经处于登录状态
        if (result) {
          dispatch('listenForConnection')

          try {
            const provider = result.providerData[0].providerId

            if (provider !== 'password') {
              const user = result.providerData[0]
              const userId = result.uid

              await dispatch(
                'users/updateUser',
                { userId, user },
                { root: true }
              )
            }

            await dispatch('fetchAuthUser')

            resolve(true)
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
        .then(() => {
          commit('SET_AUTH_USER', userId)
          resolve()
        })
        .catch(error => reject(error))
    })
  },

  // 邮箱和密码注册
  signUpWithEmailAndPwd({ dispatch }, { email, password, username }) {
    return new Promise((resolve, reject) => {
      auth
        .createUserWithEmailAndPassword(email, password)
        .then(result => {
          console.log(result)
          const usersRef = firestoreDB.collection('users')

          const user = result.user
          const userId = result.user.uid
          console.log(userId)
          usersRef
            .doc(userId)
            .get()
            .then(doc => {
              // If the user does not exist then create
              if (!doc.exists) {
                dispatch(
                  'users/createUser',
                  { userId, user: { ...user, username } },
                  { root: true }
                )
                  .then(() => resolve())
                  .catch(error => reject(error))
              }
            })
        })
        .catch(error => reject(error))
    })
  },

  // 邮箱和密码登录
  signInWithEmailAndPwd({ dispatch }, { email, password }) {
    return new Promise((resolve, reject) => {
      auth
        .signInWithEmailAndPassword(email, password)
        .then(() => resolve())
        .catch(error => reject(error))
    })
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

    connectedRef.on('value', async snapshot => {
      // If we're not currently connected, don't do anything.
      if (snapshot.val() === false) {
        return false
      }

      // If we are currently connected, then use the 'onDisconnect()'
      // method to add a set which will only trigger once this
      // client has disconnected by closing the app,
      // losing internet, or any other means.
      await dispatch('disconnect')
      await dispatch('setOnlineStatus')
    })
  },

  setOnlineStatus() {
    // Fetch the current user's ID from Firebase Authentication.
    const userId = auth.currentUser.uid

    // Create a reference to this user's specific status node.
    // This is where we will store data about being online/offline.
    const userStatusDatabaseRef = realtimeDB.ref(`/status/${userId}`)

    // We'll create two constants which we will write to
    // the Realtime database when this device is offline or online.
    const isOnlineForDatabase = {
      state: 'online',
      last_changed: window.firebase.database.ServerValue.TIMESTAMP
    }

    // We can now safely set ourselves as 'online' knowing that the
    // server will mark us as offline once we lose connection.
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
      // Fetch the current user's ID from Firebase Authentication.
      const userId = auth.currentUser.uid

      // Create a reference to this user's specific status node.
      // This is where we will store data about being online/offline.
      const userStatusDatabaseRef = realtimeDB.ref(`/status/${userId}`)

      // We'll create two constants which we will write to
      // the Realtime database when this device is offline or online.
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
