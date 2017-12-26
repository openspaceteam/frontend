import Vue from 'vue'
import Router from 'vue-router'

import Store from './store.js'
import Game from '@/components/scenes/Game.vue'
import Start from '@/components/scenes/Start.vue'
import Host from '@/components/scenes/Host.vue'
import Join from '@/components/scenes/Join.vue'
import JoinPrivate from '@/components/scenes/JoinPrivate.vue'
import Lobby from '@/components/scenes/Lobby.vue'

Vue.use(Router)

const router = new Router({
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
      name: 'Game',
      component: Game,
      meta: {
        game: true
      }
    },
    {
      path: '/lobby/:gameID',
      name: 'Lobby',
      component: Lobby,
      meta: {
        game: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.game) && !Store.getters.inGame) {
    next('/')
  } else {
    next()
  }
})

export default router
