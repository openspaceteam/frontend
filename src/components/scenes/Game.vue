<template>
  <div id="intro" class="space-font">
    <div class="top" :class="{ large: !inGame, small: inGame }">
      <death-barrier :position='deathBarrierPosition'></death-barrier>
      <ship v-if="showShip" :left="shipLeft" :transitionSpeed="outroAnimation ? 4 : levelTransition ? 0 : 1"></ship>
      <transition name="v-fade">
        <span class="outline" v-if="printingWelcome || levelTransition">Settore {{ levelInfo.level }}</span>
      </transition>

      <transition name="v-fade">
        <span class="outline" v-if="outroAnimation">Iperspazio!</span>
      </transition>
    </div>
    <div class="bottom" v-if="printingWelcome">
      <welcome-text @completed="introDone()"></welcome-text>
      <icon class="fast-forward" @click.native='introDone()' name="forward" scale="2"></icon>
    </div>
    <div class="bottom loading" v-else-if="waitingPlayers">
      <div><icon class="loading-icon" name="circle-o-notch" scale="3" spin></icon></div>
      <div class="space-font-mono"><span>In attesa degli altri giocatori...</span></div>
    </div>
    <div class="bottom" v-else-if="inGame || outroAnimation">
      <transition name="v-fade">
        <div id="alarm-light" v-if="showAlarm"></div>
      </transition>
      <transition name="v-fade">
        <!-- TODO: Move fader here as well, out of game-fields -->
        <game-field :grid="gameGrid" :levelCompleted="!inGame" @outroAnimationDone="outroAnimationDone()"></game-field>
      </transition>
    </div>
    <div class="bottom" v-else-if="levelTransition">
      <level-intro :text="levelInfo.modifierText" :alert="levelInfo.modifier !== null"></level-intro>
    </div>
  </div>
</template>

<script>
  import Ship from '@/components/objects/Ship.vue'
  import DeathBarrier from '@/components/objects/DeathBarrier.vue'
  import WelcomeText from '@/components/objects/WelcomeText.vue'
  import GameField from '@/components/objects/GameField.vue'
  import LevelIntro from '@/components/objects/LevelIntro.vue'
  import { PRINTING_WELCOME, WAITING_PLAYERS, IN_GAME, LEVEL_TRANSITION, OUTRO_ANIMATION } from '@/gameStatuses.js'

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
      LevelIntro
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
    },
    destroyed () {
      this.$bus.$off('#grid')
      this.$bus.$off('#health_info')
      this.$bus.$off('#next_level')
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
    transition-property: height;
  }

  #intro>.top.large {
    height: 200px;
  }

  #intro>.top.small {
    height: 150px;
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

  .bottom.loading>div>.loading-icon {
    margin: 0 auto;
    display: block;
  }

  .bottom.loading>div {
    text-align: center;
  }

  .bottom.loading>div:first-child {
    padding-top: 25%;
  }

  .bottom.loading>div:nth-child(2) {
    padding-top: 20px;
  }

  .bottom.loading>div:nth-child(2)>span {
    margin-top: 20px;
    text-align: center;
    font-size: 120%;
  }

  .bottom>.fast-forward {
    position: absolute;
    right: 20px;
    bottom: 20px;
    opacity: 0.5;
    animation: intro-ff-fade 1s forwards;
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
