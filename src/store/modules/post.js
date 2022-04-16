import * as type from '../mutation_types'
import { getAllList, API } from '@/api'
import { setVals, getVals } from '@/utils'
const state = {
  types: [],
  tags: [],
  currentPost: getVals('crt_post') || {}
}

const mutations = {
  [type.SET_CURRENT_POST](state, val) {
    state.currentPost = val
    setVals('crt_post', val)
  },
  [type.SET_TPYES](state, val) {
    state.types = val
  },
  [type.SET_TAGS](state, val) {
    state.tags = val
  }
}

const getters = {
  [type.GET_TYPE]: (state) => (id) => {
    return state.types.find((i) => i.id === id)
  }
}
const actions = {
  [type.FETCH_TYPE]({ commit }) {
    return new Promise((resolve, reject) => {
      getAllList(API.NOTE_TYPE)
        .then((res) => {
          const { data, success, message } = res
          success && commit(type.SET_TPYES, data)
          resolve()
        })
        .catch((err) => {
          console.log('err :>> ', err)
          reject(err)
        })
    })
  },
  [type.FETCH_TAG]({ commit }) {
    return new Promise((resolve, reject) => {
      getAllList(API.TAG)
        .then((res) => {
          const { data, success, message } = res
          success && commit(type.SET_TAGS, data)
          resolve()
        })
        .catch((err) => {
          console.log('err :>> ', err)
          reject(err)
        })
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
