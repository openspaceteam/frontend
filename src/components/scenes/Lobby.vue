<template>
  <div id="lobby-page-container">
    <div class="fader" v-if="inIntro"></div>
    <div id="lobby" class="menu-pane separated-container">
      <div>
        <h1 class="space-font pacchiano">Lobby</h1>
        <div>
          <div class="separated-container slot" v-for="(slot, index) in slots" :class="{ green: slot !== null && slot.ready }">
            <!-- I don't have enough time to implement this -->
            <!-- <div>
              <push-button small fitted v-if="imHost() && isOccupied(slot) && !isHost(slot)">
                <icon name="ban"></icon>
              </push-button>
            </div> -->
            <div :class="{ empty: !isOccupied(slot), host: isHost(slot), player: !isHost(slot) }">
              <div class="name">
                <span>
                  <icon :name="slot.host ? 'bolt' : 'gamepad'" v-if="isOccupied(slot)"></icon>
                  <icon name="spinner" pulse v-else></icon>
                </span>
                <span v-if="isOccupied(slot)">
                  Player {{ index + 1 }}
                </span>
                <span v-else>
                  Waiting...
                </span>
                <span >
                  <icon v-if="slot !== null" :name="slot.ready ? 'check-circle' : 'times-circle'"></icon>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div id="players-number" v-if="imHost()" class="lobby-button-container">
          <push-button fitted  inline @click="changeLobbySize(-1)" :disabled="this.settings.size <= 2" style="float: left;" :class="settingsColourClass">
            <span><icon name="chevron-left"></icon></span>
          </push-button>
          <span :class="settingsColourClass">Numero giocatori: {{ settings.size }}</span>
          <push-button fitted inline @click="changeLobbySize(+1)" :disabled="this.settings.size >= 4" style="float: right" :class="settingsColourClass">
            <span><icon name="chevron-right"></icon></span>
          </push-button>
        </div>

        <div v-if="imHost()" class="lobby-button-container">
          <push-button @click="changeGameType()" :class="{ green: settings.public, orange: !settings.public }">
            <span><icon :name="gameTypeIcon"></icon></span>
            Game type: {{ gameTypeReadable }}
          </push-button>
        </div>

        <div v-if="!settings.public" class="lobby-button-container">
          Share this link with other players to invite them to this game
          <input class="input-field fluid" type="text" :value="lobbyLink" readonly @focus="$event.target.select()">
        </div>

        <div class="lobby-button-container">
          <push-button :class="{ green: !imReady(), orange: imReady() }" @click="toggleReady()" v-if="!gameCanStart() || !imHost()">
            <icon :name="readyIcon"></icon>
            {{ readyText }}
          </push-button>
          <push-button class="blue bold" v-else-if="imHost() && gameCanStart()" @click="startGame()">
            <icon name="play"></icon>
            Start game!
          </push-button>
        </div>

        <div id="exit" class="lobby-button-container">
          <push-button @click="leaveGame()">
            <icon name="sign-out"></icon>
            Return
          </push-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      slots: [],
      settings: {
        size: 4,
        public: true
      },
      inIntro: false
    }
  },
  mounted () {
    this.$bus.$on('#game_info', (data) => {
      let oldReadyCount = 0
      this.slots.forEach((el) => {
        if (el !== null && el.ready) {
          oldReadyCount++
        }
      })

      this.slots = data.slots
      this.settings.size = data.max_players
      this.settings.public = data.public

      let readyCount = 0
      let allReady = true
      this.slots.forEach((el) => {
        if (el !== null) {
          if (el.ready) {
            readyCount++
          } else {
            allReady = false
          }
        }
      })
      if (readyCount >= 2 && allReady && readyCount !== oldReadyCount) {
        this.playSound('sounds/all_ready.mp3')
      }
    })
    this.$bus.$on('#game_started', (data) => {
      this.inIntro = true
      this.stopBgm()
      this.playSound('sounds/game_start.mp3')
      setTimeout(() => {
        this.$router.push('/game')
      }, 2200)
    })
  },
  methods: {
    isOccupied (slot) {
      return slot !== null
    },
    isHost (slot) {
      return slot !== null && slot.host
    },
    changeLobbySize (inc) {
      if (this.inIntro) {
        return
      }
      let newSize = this.settings.size
      if (inc > 0 && this.settings.size < 4) {
        newSize++
      } else if (inc < 0 && this.settings.size > 2) {
        newSize--
      } else {
        return
      }
      this.$io.emit('change_game_settings', {
        size: newSize
      })
    },
    changeGameType () {
      if (this.inIntro) {
        return
      }
      this.$io.emit('change_game_settings', {
        public: !this.settings.public
      })
    },
    toggleReady () {
      if (this.inIntro) {
        return
      }
      this.$io.emit('ready')
    },
    gameCanStart () {
      let allReady = true
      let fullSlots = 0
      this.slots.forEach((el) => {
        if (el !== null) {
          fullSlots++
          if (!el.ready) {
            allReady = false
          }
        }
      })
      return allReady && fullSlots >= 2
    },
    imReady () {
      let slot = this.mySlot()
      if (slot === null) {
        return false
      }
      return slot.ready
    },
    imHost () {
      let slot = this.mySlot()
      if (slot === null) {
        return false
      }
      return slot.host
    },
    mySlot () {
      let slot = null
      this.slots.forEach((el) => {
        if (el !== null && el.uid === this.$store.getters.uid) {
          slot = el
        }
      })
      return slot
    },
    startGame () {
      if (this.inIntro) {
        return
      }
      this.$io.emit('start_game')
    },
    leaveGame () {
      if (this.inIntro) {
        return
      }
      this.$io.emit('leave_game')
      this.$router.push('/')
    }
  },
  computed: {
    gameTypeIcon () {
      return this.settings.public ? 'unlock' : 'lock'
    },
    gameTypeReadable () {
      return this.settings.public ? 'Public' : 'Private'
    },
    settingsColourClass () {
      return this.settings.public ? 'green' : 'orange'
    },
    readyIcon () {
      return this.imReady() ? 'times' : 'check'
    },
    readyText () {
      return this.imReady() ? "I'm not ready yet" : "I'm ready!"
    },
    lobbyLink () {
      return window.location.href
    }
  }
}
</script>

<style>
  /* kick button, not implemented */
  /* .slot>div:first-child {
    display: inline-block;
    left: 0;
    position: absolute;
  } */

  #lobby-page-container {
    width: 100%;
    height: 100%;
  }

  .slot>div:first-child>.btn-push {
    height: 25px;
  }

  .slot>div:last-child {
    display: inline-block;
    vertical-align: middle;
    width: 100%;
    padding: 4px 0 4px 0;
    vertical-align: middle;
    text-align: center;
    border-radius: 5px;
  }

  .slot>.host>div>span:nth-child(3) {
    vertical-align: middle;
  }

  .slot>div:last-child.player {
    background-color: #283593;
  }

  .slot>div:last-child.host {
    background-color: #BF360C;
  }

  .slot>div:last-child.empty {
    background-color: rgba(0, 0, 0, 0.5);
  }

  #players-number>span {
    display: inline-block;
    padding: 4px;
    font-weight: bold;
    font-size: 110%;
  }

  #players-number>span.green {
    color: #7cc576;
  }

  #players-number>span.orange {
    color: #f57936;
  }

  #lobby>#exit {
    margin-top: 30px;
  }

  .lobby-button-container {
    padding: 8px 0 8px 0;
  }
</style>