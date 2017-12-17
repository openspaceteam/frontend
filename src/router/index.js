import Vue from 'vue'
import Router from 'vue-router'
import Intro from '@/components/scenes/Intro.vue'
import Start from '@/components/scenes/Start.vue'
import Host from '@/components/scenes/Host.vue'
import Join from '@/components/scenes/Join.vue'
import JoinPrivate from '@/components/scenes/JoinPrivate.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Start',
      component: Start
    },
    {
      path: '/host',
      name: 'Host',
      component: Host
    },
    {
      path: '/join',
      name: 'Join',
      component: Join
    },
    {
      path: '/join/private',
      name: 'JoinPrivate',
      component: JoinPrivate
    },
    {
      path: '/game',
      name: 'Intro',
      component: Intro
    }
  ]
})
