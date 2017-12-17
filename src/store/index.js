import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    menuMusicInitialized: false
  },
  getters: {
    menuMusicInitialized (state) {
      return state.menuMusicInitialized
    }
  },
  mutations: {
    menuMusicInitialized (state) {
      state.menuMusicInitialized = true
    }
  }
})
