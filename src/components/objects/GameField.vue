<template>
  <div id="game-bottom-container">
    <div class="fader" v-show="outroAnimation" style="animation-duration: 1.5s"></div>
    <div id="instruction" class="space-font-mono">
      {{ instruction.text }}
    </div>
    <div class="progress" v-if="!outroAnimation">
      <div ref="progress" class="progress-bar"></div>
    </div>
    <div id="grid" v-if="grid !== null" :style="{ transform: 'scaleX(' + this.gridScaleX + ')' }">
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
        <span class="command-name">{{ command.name }}</span>
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
          >{{ action }}</push-button>
        </div>
        <vue-slider
          v-else-if="command.type === 'slider'"
          @drag-start="playSound('sounds/tick.mp3')"
          @drag-end="playSound('sounds/tick.mp3'); sendCommand(command, status[command.name])"
          @callback="playSound('sounds/tick.mp3')"
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
        ></vue-slider>
        <circle-slider
          v-else-if="command.type === 'circular_slider'"
          @input="playSound('sounds/tick2_' + (Math.floor(Math.random() * 3)) + '.mp3'); sendCommandDebounced(command, Math.floor(status[command.name] / 10))"
          v-model="status[command.name]"
          :circle-width="20"
          :progress-width="10"
          :knob-radius="8"
          :min="command.min"
          :max="command.max * 10"
          :side="150"
        ></circle-slider>
        <div v-else-if="command.type === 'buttons_slider'" style="display: flex;">
          <push-button
            v-for="n in command.max + 1"
            narrow
            :class="{ green: status[command.name] === n, red: status[command.name] !== n }"
            @click="setButtonsSlider(command, n); sendCommand(command, n - 1)"
            downSound='sounds/button2_down.mp3'
            upSound='sounds/button2_up.mp3'
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
  import _ from 'underscore'

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
        outroAnimation: false,         // wether we should use intro or outro animations
        nullCellAnimation: false,      // used to retrigger cell intro-outro animations (should have really used vue animations, sigh)

        gridScaleX: 1
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
    mounted () {
      this.updateProgressBar()
      this.intervalID = setInterval(this.updateProgressBar, this.progressBar.intervalTime)

      // Set initial status for switches/slider/etc
      this.grid.forEach((el) => {
        if (['switch', 'buttons_slider', 'slider', 'circular_slider'].indexOf(el.status) > -1) {
          this.status[el.name] = 0
        }
      })

      this.$bus.$on('#command', (data) => {
        if (data.hasOwnProperty('expired') && data.expired !== null) {
          if (data.expired) {
            this.playSound('sounds/error.wav')
          } else {
            this.playSound('sounds/ok.mp3')
          }
        }
        this.instruction.text = data.text
        this.instruction.time = data.time
        this.progressBar.progress = 100
      })

      this.$bus.$on('#flip_grid', () => {
        this.gridScaleX *= -1
        this.playSound('sounds/wobble.mp3')
        setTimeout(() => {
          this.refreshSliders()
        }, 550)
      })


      // Refresh all sliders when start animation end
      setTimeout(() => {
        this.refreshSliders()
      }, (0.1 * this.grid.length + 0.2) * 1000)

      this.playIntroOutroSounds()
    },
    destroyed () {
      this.$bus.$off('#command')
      if (this.progressBar.intervalID !== null) {
        clearInterval(this.progressBar.intervalID)
      }
      if (this.introOutroSounds.intervalID !== null) {
        clearInterval(this.introOutroSounds.intervalID)
      }
    },
    methods: {
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
      sendCommandDebounced: _.debounce(function (command, data) {
        // Debounced sendCommand is used on circular slider, because
        // the component only emits events when changing, even if
        // the mouse button is pressed, resulting in spamming events the server
        this.sendCommand(command, data)
      }, 300),
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
        this.$nextTick(() => {
          if (this.$refs.sliders === undefined) {
            console.warn('$refs.slider is undefined')
            return
          }
          this.$refs.sliders.forEach((el) => {
            el.refresh()
          })
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
      //     console.log('beccowowo')
      //     this.playSound('sounds/tick.mp3')
      //   },
      //   deep: true
      // }
    },
    components: {
      vueSlider,
      Switches
    }
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
    border: 1px solid white;
    width: 50px;
    padding: 2px;
    text-align: center;
    border-radius: 8px;
    background-color: #0f101c;
  }

  .command-name {
    line-height: 1;
  }

  @media screen and (max-width: 1400px) {
    #instruction {
      padding: 20px 0 20px 0;
    }

    .progress-bar {
      height: 10px;
    }
  } 

</style>