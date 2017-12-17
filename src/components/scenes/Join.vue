<template>
  <div id="join" class="menu-pane">
    <div>
      <h1 class="space-font pacchiano">Partite disponibili</h1>
      <div v-if="!loading && !joining" class="separated-container">
        <div class="games">
          <push-button v-for="game in games" :disabled="game.players == game.maxPlayers" :class="{ green: game.players < game.maxPlayers }">
            <span>
              <icon name="rocket" v-if="game.players < game.maxPlayers"></icon>
              <icon name="lock" v-else></icon>
            </span>
            {{ game.name }} ({{ game.players}}/{{ game.maxPlayers }})
          </push-button>
        </div>
        <push-button @click="$router.push('/join/private')" class="orange">
          <span><icon name="lock"></icon></span>
          Accedi a una partita privata
        </push-button>
        <push-button bold @click="$router.push('/')">
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
        games: [
          {name: 'Test', players: 0, maxPlayers: 2},
          {name: 'Test', players: 0, maxPlayers: 2},
          {name: 'Test', players: 0, maxPlayers: 2},
          {name: 'Test', players: 0, maxPlayers: 2},
          {name: 'Test', players: 0, maxPlayers: 2},
          {name: 'Test', players: 0, maxPlayers: 2},
          {name: 'Test', players: 2, maxPlayers: 2}
        ],
        loading: false,
        joining: false
      }
    }
  }
</script>

<style>
  #join>div>div>.games {
    height: 400px;
    min-height: 400px;
    overflow-y: scroll;
  }

  #join>div>div>.games>.btn-push {
    margin: 0 10px 20px 10px;
  }

  @media screen and (max-width: 800px) {
    #join {
      width: 95%;
    }
  }
</style>
