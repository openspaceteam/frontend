// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router.js'
import Element from 'element-ui'  // TODO: Remove
import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon.vue'
import Store from './store.js'
import Bus from './bus.js'
import AudioMixin from './audio.js'
import PushButton from './components/objects/PushButton.vue'

// Global components registration
Vue.component('icon', Icon)
Vue.component('push-button', PushButton)

// TODO: Remove
Vue.use(Element)

// Global prototypes registration
Vue.prototype.$store = Store
Vue.prototype.$bus = Bus
Vue.prototype.$io = null

// Global mixins registration
Vue.mixin(AudioMixin)

// Other options
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})

// Disable zooming on mobile (disabled because it breaks scrolling and swiping)
// document.documentElement.addEventListener('touchmove', function (event) {
//   event.preventDefault()
// }, false)
