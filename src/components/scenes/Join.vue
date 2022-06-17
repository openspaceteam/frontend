<template>
  <div id="join" class="menu-pane">
    <div>
      <h1 class="space-font pacchiano">Matches available</h1>
      <div v-if="!loading && !joining" class="separated-container">
        <div class="games">
          <push-button
            v-for="(game, gameID) in games" :disabled="game.players == game.max_players"
            @click="joinGame(gameID)"
            :class="{ green: game.players < game.max_players }"
            :key="game.game_id">
            <span>
              <icon name="rocket" v-if="game.players < game.max_players"></icon>
              <icon name="lock" v-else></icon>
            </span>
            {{ game.name }} ({{ game.players}}/{{ game.max_players }})
          </push-button>
        </div>
        <push-button @click="$router.push('/join/private')" class="orange">
          <span><icon name="lock"></icon></span>
          Access a private game
        </push-button>
        <push-button bold @click="$router.push('/')">
          <span><icon name="chevron-left"></icon></span>
          Back
        </push-button>
      </div>
      <div v-else>
        <div>
          <icon name="circle-o-notch" spin scale="3"></icon>
        </div>
        <div v-if="joining">Access the game...</div>
        <div v-else>Loading games...</div>
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
      joinGame (gameID) {
        this.$io.emit('join_game', {
          'game_id': gameID
        })
      },
      joinLobby () {
        this.$io.emit('join_lobby')
      }
    },
    mounted () {
      this.$bus.$on('#game_join_fail', (data) => {
        this.playSound('sounds/error.mp3')
        console.error(data.message)
      })
      // game_join_success is globally registered (used it host page as well)
      this.$bus.$on('#lobby_info', (data) => {
        // NOTE: https://vuejs.org/v2/guide/reactivity.html#Change-Detection-Caveats
        this.$set(this.games, data.game_id, data)
      })
      this.$bus.$on('#lobby_disposed', (data) => {
        this.$delete(this.games, data.game_id)
      })
      this.$bus.$on('#connect', () => {
        this.joinLobby()
      })
      if (this.$store.getters.isConnected) {
        this.joinLobby()
      }
    },
    destroyed () {
      this.$bus.$off('#lobby_info')
      this.$bus.$off('#lobby_disposed')
      this.$io.emit('leave_lobby')
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
