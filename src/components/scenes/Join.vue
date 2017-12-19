<template>
  <div id="join" class="menu-pane">
    <div>
      <h1 class="space-font pacchiano">Partite disponibili</h1>
      <div v-if="!loading && !joining" class="separated-container">
        <div class="games">
          <push-button v-for="(game, gameID) in games" :disabled="game.players == game.max_players" :class="{ green: game.players < game.max_players }">
            <span>
              <icon name="rocket" v-if="game.players < game.max_players"></icon>
              <icon name="lock" v-else></icon>
            </span>
            {{ game.name }} ({{ game.players}}/{{ game.max_players }})
          </push-button>
        </div>
        <push-button @click="$router.push('/join/private')" class="orange">
          <span><icon name="lock"></icon></span>
          Accedi a una partita privata
        </push-button>
        <push-button bold @click="leaveLobby()">
          <span><icon name="chevron-left"></icon></span>
          Indietro
        </push-button>
      </div>
      <div v-else>
        <div>
          <icon name="circle-o-notch" spin scale="3"></icon>
        </div>
        <div v-if="joining">Accesso alla partita...</div>
        <div v-else>Caricamento partite...</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        games: {},
        loading: false,
        joining: false
      }
    },
    methods: {
      leaveLobby () {
        this.$io.emit('leave_lobby')
        this.$router.push('/')
      }
    },
    mounted () {
      this.$bus.$on('#lobby_info', (data) => {
        // NOTE: https://vuejs.org/v2/guide/reactivity.html#Change-Detection-Caveats
        this.$set(this.games, data.game_id, data)
      })
      this.$bus.$on('#lobby_disposed', (data) => {
        this.$delete(this.games, data.game_id)
      })
      this.$io.emit('join_lobby')
    },
    destroyed () {
      this.$bus.$off('#lobby_info')
      this.$bus.$off('#lobby_disposed')
    }
  }
</script>

<style>
  #join>div>div>.games {
    height: 300px;
    min-height: 300px;
    overflow-y: scroll;
  }

  #join>div>div>.games>.btn-push {
    margin: 0 10px 20px 10px;
  }

  @media screen and (max-width: 800px) {
    #join {
      width: 95%;
    }

    #join>div>div>.games {
      height: 200px;
      min-height: 200px;
      overflow-y: scroll;
    }
  }
</style>
