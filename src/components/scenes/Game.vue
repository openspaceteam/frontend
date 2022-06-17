<template>
  <div id="intro" class="space-font">
    <div class="top" :class="{ large: !inGame, small: inGame, dark: disconnected || gameOver }">
      <death-barrier :position='deathBarrierPosition'></death-barrier>
      <ship v-if="showShip" :left="shipLeft" :transitionSpeed="outroAnimation ? 4 : levelTransition ? 0 : 1"></ship>
      <transition name="v-fade">
        <span class="outline" v-if="printingWelcome || levelTransition">Sector {{ levelInfo.level }}</span>
      </transition>

      <transition name="v-fade">
        <span class="outline" v-if="outroAnimation">Hyperspace!</span>
      </transition>
    </div>
    <div class="bottom" v-if="printingWelcome">
      <welcome-text @completed="introDone()"></welcome-text>
      <icon class="fast-forward" @click.native='introDone()' name="forward" scale="2"></icon>
    </div>
    <div class="bottom centered" v-else-if="waitingPlayers">
      <div><icon class="icon" name="circle-o-notch" scale="3" spin></icon></div>
      <div class="space-font-mono"><span>Waiting for the other players...</span></div>
    </div>
    <div class="bottom" v-else-if="inGame || outroAnimation">
      <transition name="v-fade">
        <div id="alarm-light" v-if="showAlarm"></div>
      </transition>
      <transition name="v-fade-half" @after-enter="showSafe = false">
        <div id="safe" v-if="showSafe">
          <div><icon class="icon" name="fire-extinguisher" scale="5"></icon></div>
          <div>Safe!</div>
        </div>
      </transition>
      <transition name="v-fade">
        <!-- TODO: Move fader here as well, out of game-fields -->
        <game-field :grid="gameGrid" :levelCompleted="!inGame" @outroAnimationDone="outroAnimationDone()" @safe="safe()"></game-field>
      </transition>
    </div>
    <div class="bottom" v-else-if="levelTransition">
      <level-intro :text="levelInfo.modifierText" :alert="levelInfo.modifier"></level-intro>
    </div>
    <div class="bottom centered" v-else-if="disconnected">
      <div><icon class="icon" name="unlink" scale="3"></icon></div>
      <div class="space-font-mono"><span>Disconnected</span></div>
      <div class="back-button">
        <push-button class="orange space-font-mono" narrow @click="goToMenu()">
          <span><icon name="fire-extinguisher"></icon></span>
          Return to Menu
        </push-button>
      </div>
    </div>
    <div class="bottom centered" v-else-if="gameOver">
      <div><icon class="icon" name="bomb" scale="3"></icon></div>
      <div class="space-font-mono"><span>Game over</span></div>
      <div class="back-button">
        <push-button class="green space-font-mono" narrow @click="restartGame()">
          <span><icon name="play-o"></icon></span>
          Try again
        </push-button>
        <push-button class="orange space-font-mono" narrow @click="goToMenu()">
          <span><icon name="frown-o"></icon></span>
          Exit
        </push-button>
      </div>
    </div>
  </div>
</template>

<script>
  import Ship from '@/components/objects/Ship.vue'
  import DeathBarrier from '@/components/objects/DeathBarrier.vue'
  import WelcomeText from '@/components/objects/WelcomeText.vue'
  import GameField from '@/components/objects/GameField.vue'
  import LevelIntro from '@/components/objects/LevelIntro.vue'
  import PushButton from '@/components/objects/PushButton.vue'
  import { PRINTING_WELCOME, WAITING_PLAYERS, IN_GAME, LEVEL_TRANSITION, OUTRO_ANIMATION, DISCONNECTED, GAME_OVER } from '@/gameStatuses.js'

  export default {
    data () {
      return {
        gameGrid: null,

        status: PRINTING_WELCOME,

        healthInfo: {
          health: 50,
          deathLimit: 0
        },

        showShip: true,
        showAlarm: false,
        showSafe: false,

        levelInfo: {
          level: 1,
          modifier: null,
          modifierText: ''
        }
      }
    },
    components: {
      Ship,
      WelcomeText,
      GameField,
      DeathBarrier,
      DeathBarrier,
      LevelIntro,
      PushButton
    },
    mounted () {
      // this.playBgm('static/music/ship_engine.mp3')

      this.$bus.$on('#grid', (data) => {
        console.log('all intro done ack received')
        this.status = IN_GAME
        this.gameGrid = data
      })

      this.$bus.$on('#health_info', (data) => {
        this.$set(this.healthInfo, 'health', data.health)
        this.$set(this.healthInfo, 'deathLimit', data.death_limit)

        // Alarm check
        if (this.healthInfo.health <= (this.healthInfo.deathLimit + 7)) {
          this.showAlarm = true
          this.playSound('sounds/alarm.mp3', true)
        } else if (this.showAlarm) {
          this.showAlarm = false
          this.stopSound('sounds/alarm.mp3', 1500)
        }
      })

      this.$bus.$on('#next_level', (data) => {
        // Change game status
        this.status = OUTRO_ANIMATION
      
        // Set level and modifier
        this.levelInfo.level = data.level + 1
        if (data.hasOwnProperty('modifier')) {
          this.levelInfo.modifier = data.modifier
        } else {
          this.levelInfo.modifier = null
        }
        this.levelInfo.modifierText = data.text

        // Reset health and death barrier
        this.healthInfo.health = 50
        this.healthInfo.deathLimit = 0

        setTimeout(() => {
          // Reposition ship right before fader gets removed
          this.showShip = false
          this.$nextTick(() => {
            this.showShip = true
          })
        }, 4499)
      })

      this.$bus.$on('#disconnect', this.haltGameDisconnect)
      this.$bus.$on('#player_disconnected', this.haltGameDisconnect)
      this.$bus.$on('#game_over', () => {
        this.status = GAME_OVER
        this.stopSound('sounds/alarm.mp3')
        this.playSound('sounds/gameover.mp3')
      })
    },
    destroyed () {
      this.$bus.$off('#grid')
      this.$bus.$off('#health_info')
      this.$bus.$off('#next_level')
      this.$bus.$off('#game_over')
    },
    methods: {
      introDone () {
        this.status = WAITING_PLAYERS
        this.$io.emit('intro_done')
      },
      outroAnimationDone () {
        this.status = LEVEL_TRANSITION
        setTimeout(() => {
          this.introDone()
        }, 5000)
      },
      goToMenu () {
        window.location.replace('/')
      },
      restartGame () {
        //this.$io.emit("start_game")
        this.status === PRINTING_WELCOME
      },
      haltGameDisconnect () {
        this.status = DISCONNECTED
        this.playSound('sounds/disconnected.mp3')
      },
      safe () {
        this.showSafe = true
        this.playSound('sounds/safe.mp3')
      }
    },
    computed: {
      shipLeft () {
        if (this.status === IN_GAME) {
          return (this.healthInfo.health - 15) + '%'
        } else if (this.status === OUTRO_ANIMATION) {
          return '150%'
        } else {
          return '0'
        }
      },
      deathBarrierPosition () {
        return (this.status === IN_GAME) ? (this.healthInfo.deathLimit) : '-50%'
      },
      // We can't use constants in templates :(
      inGame () {
        return this.status === IN_GAME
      },
      levelTransition () {
        return this.status === LEVEL_TRANSITION
      },
      waitingPlayers () {
        return this.status === WAITING_PLAYERS
      },
      printingWelcome () {
        return this.status === PRINTING_WELCOME
      },
      outroAnimation () {
        return this.status === OUTRO_ANIMATION
      },
      disconnected () {
        return this.status === DISCONNECTED
      },
      gameOver () {
        return this.status === GAME_OVER
      }
    }
  }
</script>

<style>
  #intro {
    height: 100%;
    position: relative;
    overflow: hidden;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
  }

  #intro>.top {
    color: white;
    position: relative;
    background: url('../../assets/darkPurple.png') 0 0 repeat;
    animation: move-intro-top-background 200s linear infinite;
    transition: 0.5s ease-in-out;
    transition-property: height opacity;
  }

  #intro>.top.large {
    height: 200px;
  }

  #intro>.top.small {
    height: 150px;
  }

  #intro>.top.dark {
    opacity: 0.5;
  }

  @keyframes move-intro-top-background {
    from { background-position-x: 0; }
    to { background-position-x: -200%; }
  }

  .top>span {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 180%;
    z-index: 10001;  /* above fader */
  }

  #intro>.bottom {
    width: 100%;
    height: 100%;
    background-color: black;
    color: white;
    display: flex;
    flex-direction: column;
  }

  .bottom.centered>div>.icon {
    margin: 0 auto;
    display: block;
  }

  .bottom.centered>div {
    text-align: center;
  }

  .bottom.centered>div:first-child {
    padding-top: 25%;
  }

  .bottom.centered>div:nth-child(2) {
    padding-top: 20px;
  }

  .bottom.centered>div:nth-child(2)>span {
    margin-top: 20px;
    text-align: center;
    font-size: 120%;
  }

  .bottom.centered>div:nth-child(3) {
    margin: 10px auto;
    width: 25%;
  }

  .bottom>.fast-forward {
    position: absolute;
    right: 20px;
    bottom: 20px;
    opacity: 0.5;
    animation: intro-ff-fade 1s forwards;
  }

  #alarm-light {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1000;
    width: 100%;
    height: 100%;
    background-color: red;
    opacity: .3;
    animation: alarm-light-pulse 1.15s infinite ease-in-out both;
    pointer-events: none;
  }

  #safe {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1100;
    width: 100%;
    height: 100%;
    background-color: #23af3a;
    pointer-events: none;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    font-size: 150%;
  }

  @keyframes intro-ff-fade {
    from { opacity: 0; }
    to { opacity: 0.5; }
  }

  @media screen and (min-width: 799px) {
    #intro {
      width: 800px;
      border-left: 2px solid white;
      border-right: 2px solid white;
    }
  }

  @media screen and (max-width: 800px) {
    #intro {
      width: 100%;
    }
  }

  @media screen and (max-width: 1400px) {
    #intro>.top.small {
      height: 125px;
    }
  }
</style>
