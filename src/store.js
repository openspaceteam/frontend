import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    menuMusicInitialized: false,
    socket: {
      connected: false,
      connecting: true
    }
  },
  getters: {
    menuMusicInitialized (state) {
      return state.menuMusicInitialized
    },
    isConnecting (state) {
      return state.socket.connecting
    },
    isConnected (state) {
      return state.socket.connected
    }
  },
  mutations: {
    menuMusicInitialized (state) {
      state.menuMusicInitialized = true
    },
    connected (state) {
      state.socket.connecting = false
      state.socket.connected = true
    },
    connectionFailed (state) {
      state.socket.connecting = false
      state.socket.connected = false
    }
  }
})
