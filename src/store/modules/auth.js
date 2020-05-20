import * as firebase from 'firebase/app'
import {
  auth,
  database,
  twitterProvider,
  googleAuthProvider,
  githubAuthProvider
} from '@/firebase.config'

// initial state
const state = () => ({
  authId: null
})

// getters
const getters = {
  authId: state => {
    return state.authId
  }
}

// actions
const actions = {
  initAuthentication({ dispatch }) {
    return new Promise((resolve, reject) => {
      auth.onAuthStateChanged(async result => {
        if (result) {
          // 如果 user 存在，说明用户已经处于登录状态
          const userId = result.uid
          const user = result.providerData[0]

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
    const userId = auth.currentUser.uid

    return new Promise((resolve, reject) => {
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
    return new Promise((resolve, reject) =>
      auth
        .setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then(() =>
          auth
            .signInWithPopup(provider)
            .then(result => {
              const usersRef = database.collection('users')

              const user = result.additionalUserInfo.profile
              const userId = result.user.uid

              usersRef
                .doc(userId)
                .get()
                .then(doc => {
                  if (!doc.exists) {
                    // If the user does not exist then create
                    dispatch(
                      'users/createUser',
                      { userId, user },
                      { root: true }
                    )
                      .then(() => resolve())
                      .catch(error => reject(error))
                  } else {
                    resolve()
                  }
                })
            })
            .catch(error => reject(error))
        )
        .catch(error => reject(error))
    )
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
  getters,
  actions,
  mutations
}
