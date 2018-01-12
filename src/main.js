// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

import io from 'socket.io-client'
import SocketIOWildcard from 'socketio-wildcard'
import 'vue-awesome/icons'

import router from './router.js'
import App from './App'
import Icon from 'vue-awesome/components/Icon.vue'
import PushButton from './components/objects/PushButton.vue'

import Store from './store.js'
import Bus from './bus.js'
import AudioMixin from './audio.js'
import GeneralMixin from './general.js'
import Config from './config.js'
import VueCircleSlider from 'vue-circle-slider'

// Global components registration
Vue.component('icon', Icon)
Vue.component('push-button', PushButton)
Vue.use(VueCircleSlider)

// Global prototypes registration
Vue.prototype.$store = Store
Vue.prototype.$bus = Bus

// Global mixins registration
Vue.mixin(AudioMixin)
Vue.mixin(GeneralMixin)

// Other options
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  mounted () {
    // Connect when the app is mounted on the DOM
    Vue.prototype.$io = io(Config.serverURL, {
      transports: ['websocket', 'xhr-polling', 'polling', 'htmlfile', 'flashsocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity
    })

    // Enable wildcard support
    SocketIOWildcard(io.Manager)(this.$io)

    this.$io.on('welcome', (data) => {
      console.log('Greeted by server with uid ' + data.uid)
      this.$store.commit('connected', data.uid)
    })

    this.$io.on('connect', () => {
      this.$bus.$emit('#connect')

      this.$io.on('disconnect', () => {
        console.warn('disconnected')
        this.$store.commit('connectionFailed')
        this.$store.commit('inGame', false)
        this.$bus.$emit('#disconnect')
      })
      this.$io.on('game_join_success', (data) => {
        this.playSound('sounds/lobby_join.mp3')
        this.$store.commit('inGame', true)
        this.$router.push('/lobby/' + data.game_id)
      })
      this.$io.on('*', (eventData) => {
        // Emit all unbound events to the global event bus
        // as #event_name, so components can listen to them
        let [event, data] = eventData.data
        if (event.startsWith('error_')) {
          console.error('Got error from server (' + event + '). Data below.')
          console.log(data)
        } else {
          console.log('Got arbitrary event #' + event + '. Data below.')
          console.log(data)
          this.$bus.$emit('#' + event, data)
        }
      })

      this.$bus.$emit('#connected')
    })
  }
})

// Disable zooming on mobile (disabled because it breaks scrolling and swiping)
// document.documentElement.addEventListener('touchmove', function (event) {
//   event.preventDefault()
// }, false)
