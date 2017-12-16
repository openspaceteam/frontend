import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    sounds: {}
  },
  getters: {
    getSound: (state) => (key) => {
      if (state.sounds.hasOwnProperty(key)) {
        console.log(state.sounds)
        return state.sounds[key]
      }
    }
  },
  mutations: {
    registerSound (state, key, sound) {
      console.log(key)
      console.log(sound)
      state.sounds[key] = sound
    }
  }
})
