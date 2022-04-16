// import { login, logout, getInfo } from '@/api/user'
import { login, logout, API, getAllList } from '@/api'

import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { getVal, setVal, removeVal, obj2Params } from '@/utils'
import * as type from '../mutation_types'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    currentUser: getVal('currentUser'),
    userlist: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  [type.SET_CRTUSER]: (state, user) => {
    state.currentUser = user
    setVal('currentUser', user)
  },
  [type.SET_USER]: (state, data) => {
    state.userlist = data
  }
}
const getters = {
  [type.GET_USER]: (state) => (id) => {
    return state.userlist.find((i) => i.id === id)
  }
}

const actions = {
  login({ commit }, userInfo) {
    const params = obj2Params(userInfo)
    return new Promise((resolve, reject) => {
      login(params)
        .then((res) => {
          const { data, message, success } = res
          if (success) {
            // const token = getToken()
            // debugger
            // commit('SET_TOKEN', token)
            commit(type.SET_CRTUSER, data)
          }
          resolve({ success, message, data })
        })
        .catch((err) => {
          reject({ success: false, message: err })
        })
    })
  },
  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then((response) => {
          const { data } = response
          if (!data) {
            return reject('Verification failed, please Login again.')
          }

          const { name, avatar } = data
          commit('SET_NAME', name)
          commit('SET_AVATAR', avatar)
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout()
        .then(() => {
          removeToken() // must remove  token  first
          resetRouter()
          removeVal('currentUser')
          commit('RESET_STATE')
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  [type.FETCH_USER]({ commit, state }) {
    return new Promise((resolve, reject) => {
      getAllList(API.USER)
        .then((res) => {
          commit(type.SET_USER, res.data)
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
