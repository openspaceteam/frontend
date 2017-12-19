// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

import Element from 'element-ui'  // TODO: Remove
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
import Config from './config.js'

// Global components registration
Vue.component('icon', Icon)
Vue.component('push-button', PushButton)

// TODO: Remove
Vue.use(Element)

// Global prototypes registration
Vue.prototype.$store = Store
Vue.prototype.$bus = Bus
// Vue.prototype.$io = null  // we start without a connection

// Global mixins registration
Vue.mixin(AudioMixin)

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
    Vue.prototype.$io = io(Config.serverURL)
    SocketIOWildcard(io.Manager)(this.$io)
    console.log(this.$io)
    this.$io.on('connect', () => {
      console.log('connected')
      this.$store.commit('connected')

      this.$io.on('disconnect', () => {
        console.warn('disconnected')
        this.$store.commit('connectionFailed')
      })
      this.$io.on('lobby_joined', (data) => {
        console.log(data)
        this.playSound('sounds/lobby_join.wav')
        this.$router.push('lobby/' + data.game_id)
      })
      this.$io.on('*', (eventData) => {
        console.log('Got arbitrary event')
        let [event, data] = eventData.data
        this.$bus.$emit('#' + event, data)
        console.log('emitting on #' + event)
      })
    })
  }
})

// Disable zooming on mobile (disabled because it breaks scrolling and swiping)
// document.documentElement.addEventListener('touchmove', function (event) {
//   event.preventDefault()
// }, false)
