<template>
  <div id="game-bottom-container">
    <div id="instruction" class="space-font-mono">
      Accendere triangolo di Monstrata
    </div>
    <div class="progress">
      <div ref="progress" class="progress-bar"></div>
    </div>
    <div id="grid" v-if="grid !== null">
      <div class="cell"
      v-for="command in grid"
      :style="{
        'grid-row': gridRow(command),
        'grid-column': gridColumn(command)
      }">
        <span>{{ command.name }}</span>
        <push-button
          v-if="command.type === 'button'"
          @click="sendCommand(command)"
          empty class="red"
        ></push-button>
        <switches
          v-else-if="command.type === 'switch'"
          @input="sendCommand(command, { toggled: status[command.name] })"
          v-model="status[command.name]"
          :type-bold="true"
          :emit-on-mount="false"
          color="blue"
          theme="custom"
        ></switches>
        <div v-else-if="command.type === 'actions'">
          <push-button v-for="action in command.actions" narrow class="red" @click="sendCommand(command, { action })">{{ action }}</push-button>
        </div>
        <vue-slider
          v-else-if="command.type === 'slider'"
          @callback="sendCommand(command, { value: $event })"
          v-model="status[command.name]"
          :width="(command.w > command.h) ? 280 : 12"
          :height="(command.w > command.h) ? 12 : 200"
          :direction="(command.w > command.h) ? 'horizontal' : 'vertical'"
          :min="command.min"
          :max="command.max"
          :dotSize="20"
          :speed="0.3"
          :lazy="true"
          tooltip="hover"
          :piecewise="true"
        ></vue-slider>
        <circle-slider
          v-else-if="command.type === 'circular_slider'"
          @mouseup.native.prevent="sendCommand(command, { value: status[command.name] })"
          @mouseleave.native.prevent="sendCommand(command, { value: status[command.name] })"
          v-model="status[command.name]"
          :circle-width="20"
          :progress-width="10"
          :knob-radius="10"
          :min="command.min"
          :max="command.max"
          :side="150"
        ></circle-slider>
        <div v-else-if="command.type === 'buttons_slider'" style="display: flex;">
          <push-button v-for="n in command.max" narrow class="red" @click="sendCommand(command, { value: n })">{{ n }}</push-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import vueSlider from 'vue-slider-component'
  import Switches from 'vue-switches'
  // import _ from 'underscore'

  export default {
    data () {
      return {
        commandTime: 10,
        progressBar: {
          progress: 100,
          intervalTime: 25
        },
        status: {}
      }
    },
    props: ['grid'],
    mounted () {
      this.updateProgressBar()
      setInterval(this.updateProgressBar, this.progressBar.intervalTime)

      // Set initial status for switches/slider/etc
      this.grid.forEach((el) => {
        if (['switch', 'buttons_slider', 'slider', 'circular_slider'].indexOf(el.status) > -1) {
          this.status[el.name] = 0
        }
      })
    },
    methods: {
      updateProgressBar () {
        this.progressBar.progress -= (100 * this.progressBar.intervalTime) / (this.commandTime * 1000)
        if (this.progressBar.progress <= 0) {
          this.progressBar.progress = 100
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
      sendCommand (command, data) {
        let stuff = {
          command: command.name,
        }
        if (data !== undefined) {
          stuff.data = data
        }
        console.log('sendign this to server')
        console.log(stuff)
      },
      // TODO: Reimplement this?
      // sendCommandDebounced: _.debounce(function (command, data) {
      //   // Debounced sendCommand is used on circular slider, because
      //   // the component only emits events when changing, even if
      //   // the mouse button is pressed, resulting in spamming events the server
      //   this.sendCommand(command, data)
      // }, 300)
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

  #grid>.cell>span {
    text-align: center;
    width: 100%;
    margin: 0 auto;
    display: block;
    margin-bottom: 8px;
  }



  .vue-switcher-theme--custom.vue-switcher-color--blue div {
    background-color: #3333ff;
  }
  .vue-switcher-theme--custom.vue-switcher-color--blue div:after {
    background-color: #0000e6;
  }
  .vue-switcher-theme--custom.vue-switcher-color--blue.vue-switcher--unchecked div {
    background-color: #9999ff;
  }
  .vue-switcher-theme--custom.vue-switcher-color--blue.vue-switcher--unchecked div:after {
    background-color: #3333ff;
  }

</style>