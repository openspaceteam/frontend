<template>
  <div id="game-bottom-container" @mousemove="asteroid($event)">
    <div class="fader" v-show="outroAnimation" style="animation-duration: 1.5s"></div>
    <div id="instruction" class="space-font-mono" v-html="unescapeSymbols(instruction.text)">
    </div>
    <div class="progress" v-if="!outroAnimation">
      <div ref="progress" class="progress-bar"></div>
    </div>
    <div id="grid" v-if="grid !== null" :style="flipScale">
      <div class="cell"
      v-for="(command, index) in grid"
      v-if="!nullCellAnimation"
      :style="{
        'grid-row': gridRow(command),
        'grid-column': gridColumn(command),
        'animation-delay': (index * 0.1) + 's',
        'transform': 'scale(' + (outroAnimation ? '1' : '0') + ')',
        'animation': '0.2s ease-out ' + (index * 0.1) + 's 1 ' + (outroAnimation ? 'reverse' : 'normal') + ' forwards running cell-intro',  // vue.js animations would have been much better...
      }">
        <span class="command-name" :class="{ 'symbols-font': command.hasOwnProperty('symbol'), 'alien-font': command.hasOwnProperty('alien') }">{{ command.name }}</span>
        <push-button
          v-if="command.type === 'button'"
          @click="sendCommand(command)"
          empty class="red"
          downSound='sounds/button2_down.mp3'
          upSound='sounds/button2_up.mp3'
        ></push-button>
        <switches
          v-else-if="command.type === 'switch'"
          @input="playSound('sounds/switch_' + (status[command.name] ? 'on' : 'off') + '.mp3'); sendCommand(command, status[command.name])"
          v-model="status[command.name]"
          :type-bold="true"
          :emit-on-mount="false"
          color="normal"
          theme="custom"
        ></switches>
        <div v-else-if="command.type === 'actions'">
          <push-button
            v-for="action in command.actions"
            narrow
            class="red"
            @click="sendCommand(command, action)"
            downSound='sounds/button3_down.mp3'
            upSound='sounds/button3_up.mp3'
            :grid="true"
          >{{ action }}</push-button>
        </div>
        <vue-slider
          v-else-if="command.type === 'slider'"
          class="slider"
          @drag-end="sliderDrag(command)"
          @callback="sliderDrag(command)"
          v-model="status[command.name]"
          :width="(command.w > command.h) ? 280 : 12"
          :height="(command.w > command.h) ? 12 : 200"
          :direction="(command.w > command.h) ? 'horizontal' : 'vertical'"
          :min="command.min"
          :max="command.max"
          :dotSize="20"
          :speed="0.3"
          tooltip="never"
          :piecewise="true"
          :piecewiseLabel="true"
          ref="sliders"
          :labelActiveStyle='{
            "color": "#02bd7d"
          }'
          :labelStyle='{
            "color": "#34485f"
          }'
          :bgStyle='{
            "backgroundColor": "#34485f",
          }'
          :processStyle='{
            "backgroundColor": "#02bd7d"
          }'
          :style="flipScale"
        ></vue-slider>
        <circle-slider
          v-else-if="command.type === 'circular_slider'"
          class="circular-slider"
          @input="circularSliderDrag(command)"
          v-model="status[command.name]"
          :circle-width="20"
          :progress-width="10"
          :knob-radius="8"
          :min="command.min"
          :max="command.max * 10"
          :side="150"
          :style="flipScale"
        ></circle-slider>
        <div v-else-if="command.type === 'buttons_slider'" style="display: flex;">
          <push-button
            v-for="n in command.max + 1"
            narrow
            :class="{ green: status[command.name] === n, red: status[command.name] !== n }"
            @click="setButtonsSlider(command, n); sendCommand(command, n - 1)"
            downSound='sounds/button2_down.mp3'
            upSound='sounds/button2_up.mp3'
            :grid="true"
            >
              {{ n - 1 }}
            </push-button>
        </div>

        <div class="circular-slider-label" v-if="command.type === 'circular_slider'">
          {{ Math.floor(status[command.name] / 10) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import vueSlider from 'vue-slider-component'
  import Switches from 'vue-switches'
  import _ from 'lodash'
  import SymbolsMixin from '@/symbols.js'

  export default {
    data () {
      return {
        progressBar: {
          progress: 100,
          intervalTime: 25,
          intervalID: null
        },
        status: {},
        instruction: {
          text: '',
          time: 10
        },

        introOutroSounds: {
          intervalID: null,
          iteration: 1
        },
        outroAnimation: false,         // Wether we should use intro or outro animations
        nullCellAnimation: false,      // Used to retrigger cell intro-outro animations (should have really used vue animations, sigh)

        gridScaleX: 1,

        // Asteroid and black hole
        oldMouseEvent: null,          // Used to detect mouse speed
        lastEnterPress: 0
      }
    },
    props: {
      grid: {
        required: true
      },
      levelCompleted: {
        required: false,
        default: false
      }
    },
    beforeMount() {
      // Set initial status for switches/slider/etc
      this.grid.forEach((el) => {
        if (['switch', 'buttons_slider', 'slider', 'circular_slider'].indexOf(el.status) > -1) {
          this.status[el.name] = 0
        }
      })
    },
    mounted () {
      this.updateProgressBar()
      this.intervalID = setInterval(this.updateProgressBar, this.progressBar.intervalTime)

      this.$bus.$on('#command', (data) => {
        if (data.hasOwnProperty('expired') && data.expired !== null) {
          if (data.expired) {
            this.playSound('sounds/error.mp3')
          } else {
            this.playSound('sounds/ok.mp3')
          }
        }
        this.instruction.text = data.text
        this.instruction.time = data.time
        this.progressBar.progress = 100
      })

      this.$bus.$on('#safe', () => {
        this.$emit('safe')
      })

      this.$bus.$on('#flip_grid', () => {
        this.gridScaleX *= -1
        this.playSound('sounds/wobble.mp3')
        setTimeout(() => {
          this.$nextTick(() => {
            this.refreshSliders()
          })
        }, 550)
      })

      // Enter bind
      window.addEventListener('keyup', this.onKeyUp)

      // Refresh all sliders when start animation end
      setTimeout(() => {
        this.$nextTick(() => {
          this.refreshSliders()
        })
      }, (0.1 * this.grid.length + 0.2) * 1000)

      this.playIntroOutroSounds()
    },
    destroyed () {
      this.$bus.$off('#command')
      this.$bus.$off('#flip_grid')
      this.$bus.$off('#safe')
      window.removeEventListener('keyup', this.onKeyUp)
      if (this.progressBar.intervalID !== null) {
        clearInterval(this.progressBar.intervalID)
      }
      if (this.introOutroSounds.intervalID !== null) {
        clearInterval(this.introOutroSounds.intervalID)
      }
    },
    methods: {
      onKeyUp(event) {
        if (event.keyCode === 13) {
          this.blackHole()
        }
      },
      updateProgressBar () {
        this.progressBar.progress -= (100 * this.progressBar.intervalTime) / (this.instruction.time * 1000)
        if (this.progressBar.progress < 0) {
          this.progressBar.progress = 0
        }
        if (this.$refs.progress !== undefined) {
          let p = this.progressBar.progress
          let c = ''
          if (p <= 5) {
            c = '#f63a0f'
          } else if (p > 5 && p <= 25) {
            c = '#f27011'
          } else if (p > 25 && p <= 50) {
            c = '#f2b01e'
          } else if (p > 50 && p <= 75) {
            c = '#f2d31b'
          } else {
            c = '#86e01e'
          }
          this.$refs.progress.style.width = p + '%'
          this.$refs.progress.style.backgroundColor = c
        }
      },
      gridColumn (command) {
        let value = command.x + 1
        if (command.w > 0) {
          value += '/' + (command.x + 1 + command.w)
        }
        return value
      },
      gridRow (command) {
        let value = command.y + 1
        if (command.h > 0) {
          value += '/' + (command.y + 1 + command.h)
        }
        return value
      },
      sendCommand (command, value) {
        let commandData = {
          name: command.name,
        }
        if (value !== undefined) {
          commandData.value = value
        }
        this.$io.emit('command', commandData)
      },
      setButtonsSlider (command, n) {
        this.$set(this.status, command.name, n)
      },
      playIntroOutroSounds(outro) {
        let soundPath = (outro !== undefined && !outro) ? 'wosh-out' : 'wosh'
        this.playSound('sounds/' + soundPath + '.mp3')
          this.introOutroSounds.intervalID = setInterval(() => {
            this.playSound('sounds/' + soundPath + '.mp3')
            this.introOutroSounds.iteration++
            if (this.introOutroSounds.iteration === this.grid.length) {
              this.introOutroSounds.iteration = 0
              clearInterval(this.introOutroSounds.intervalID)
            }
          }, 100)
      },
      refreshSliders() {
        if (this.$refs.sliders === undefined) {
          console.warn('$refs.slider is undefined')
          return
        }
        this.$refs.sliders.forEach((el) => {
          el.refresh()
        })
      },
      asteroid (ev) {
        ev.time = Date.now()
        let speed = this.calculateMouseVelocity(ev, this.oldMouseEvent)
        this.oldMouseEvent = ev

        if (speed >= 10) {
          this.sendAsteroidDefeatThrottled()
        }
      },
      blackHole () {
        let now = Date.now()
        if (now - this.lastEnterPress < 250) {
          this.sendBlackHoleDefeatThrottled()
        }
        this.lastEnterPress = now
      },
      calculateMouseVelocity(ev, oldEv) {
        let x = ev.clientX, newX, newY, newT, xDist, yDist, interval, velocity, y = ev.clientY, t

        if (oldEv === null) {
          return 0
        }

        t = oldEv.time
        newX = oldEv.clientX
        newY = oldEv.clientY
        newT = Date.now()
        xDist = newX - x
        yDist = newY - y
        interval = newT - t

        velocity = Math.sqrt(xDist * xDist + yDist * yDist) / interval
        return velocity
      },
      sendBlackHoleDefeatThrottled: _.throttle(function () {
        console.log('black hole!')
        console.log(this)
        this.$io.emit('defeat_black_hole')
      }, 1500),
      sendAsteroidDefeatThrottled: _.throttle(function () {
        console.log('asteroid!')
        this.$io.emit('defeat_asteroid')
      }, 1500),
      sendCommandDebounced: _.debounce(function (command, preprocessor) {
        // Debvounced sendCommand is used on circular slider, because
        // the component only emits events when changing, even if
        // the mouse button is pressed, resulting in spamming events the server

        // preprocessor is an optional function that can be used to edit the 
        // value before sending it
        let valueToSend = this.status[command.name]
        if (typeof preprocessor === 'function') {
          valueToSend = preprocessor(valueToSend)
        }
        this.sendCommand(command, valueToSend)
      }, 300),
      sliderDrag(command) {
        this.playSound('sounds/tick.mp3')
        this.sendCommandDebounced(command)
      },
      circularSliderDrag (command) {
        this.playSound('sounds/tick2_' + (Math.floor(Math.random() * 3)) + '.mp3')
        this.sendCommandDebounced(command, (value) => { 
          return Math.floor(value / 10)
        })
      }
    },
    watch: {
      levelCompleted () {
        this.nullCellAnimation = true
        this.outroAnimation = true
        this.$nextTick(() => {
          this.nullCellAnimation = false
          this.playIntroOutroSounds(true)
          this.playSound('sounds/transition' + (Math.floor(Math.random() * 3) + 1) + '.mp3')
          setTimeout(() => {
            this.$emit('outroAnimationDone')
          }, 4500)
        })
      },
      // status: {
      //   handler () {
      //     console.log('becco wo')
      //   },
      //   deep: true
      // }
    },
    computed: {
      flipScale() {
        return {
          transform: 'scaleX(' + this.gridScaleX + ')'
        }
      }
    },
    components: {
      vueSlider,
      Switches
    },
    mixins: [SymbolsMixin]
  }
</script>

<style>
  #instruction {
    text-align: center;
    padding: 40px 0 40px 0;
    border-bottom: 3px solid white;
    border-top: 3px solid white;
    display: block;
    background-color: #12121d;
    font-size: 125%;
  }

  .progress {
    background-color: #0b0b13;
    border-bottom: 3px solid white;
  }

  .progress-bar {
    height: 16px;
    background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.05));
    transition: 0.2s linear;
    transition-property: background-color;
    box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.25), inset 0 1px rgba(255, 255, 255, 0.1);
  }

  #game-bottom-container {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  #grid {
    height: 100%;
    background-color: #0f121a;

    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(4, 1fr);
    grid-gap: 10px;
    padding: 10px;

    transition: transform 0.8s;
  }

  #grid>.cell {
    background-color: #0a0509;
    border: 2px solid #171c2c;
    border-radius: 5px;
    padding: 12px;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  @keyframes cell-intro {
    from { transform: scale(0) }
    to { transform: scale(1) }
  }


  #grid>.cell>span {
    text-align: center;
    width: 100%;
    margin: 0 auto;
    display: block;
    margin-bottom: 8px;
    line-height: 1;
  }

  @keyframes alarm-light-pulse {
    from { opacity: 0 }
    50% { opacity: 0.3 }
    to { opacity: 0 }
  }

  .vue-switcher {
    margin-top: 10px;
  }

  .vue-switcher-theme--custom.vue-switcher-color--normal div {
    background-color: #02bd7d;
  }
  .vue-switcher-theme--custom.vue-switcher-color--normal div:after {
    background-color: #176348;
  }
  .vue-switcher-theme--custom.vue-switcher-color--normal.vue-switcher--unchecked div {
    background-color: #ff9595;
  }
  .vue-switcher-theme--custom.vue-switcher-color--normal.vue-switcher--unchecked div:after {
    background-color: #631717;
  }

  .circular-slider-label {
    margin-top: 10px;
    background-color: #0a0509;
    border: 2px solid #171c2c;
    width: 50px;
    padding: 2px;
    text-align: center;
    border-radius: 8px;
    color: #02bd7d;
    line-height: 1;
  }

  .circular-slider, .slider {
    transition: transform 0.8s;
  }

  .command-name {
    line-height: 1;
  }

  .blurred {
    color: transparent;
    text-shadow: rgba(0, 0, 0, 0.5) 0px 0px 5px; 
  }

  .command-name.symbols-font {
    font-size: 250%; 
  }

  #instruction>span.symbols-font {
    font-size: 160%;
    vertical-align: middle;
  }

  @media screen and (max-width: 1400px) {
    #instruction {
      padding: 20px 0 20px 0;
    }

    .progress-bar {
      height: 10px;
    }

    .circular-slider-label {
      padding: 7px;
      width: auto;
    }
  } 

</style>