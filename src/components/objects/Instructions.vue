<template>
  <div id="game-bottom-container">
    <div id="instruction" class="space-font-mono">
      Accendere triangolo di Monstrata
    </div>
    <div class="progress">
      <div ref="progress" class="progress-bar"></div>
    </div>
    <div id="grid">
      <div class="cell">
        <span>Triangolo di Monstrata</span>
        <push-button empty class="red"></push-button>
      </div>
      <div class="cell" style="grid-row: 2/ 4;"> 
        <span>Memini divertenti</span>
        <div>
          <push-button narrow class="red">Fai</push-button>
          <push-button narrow class="red">Colora</push-button>
          <push-button narrow class="red">Pubblica</push-button>
        </div>
      </div>
      <div class="cell" style="grid-column: 2/4;">
        <span>Becco wowo</span>
        <vue-slider :width="280" :dotSize="20" :min="0" :max="4" :speed="0.3" :lazy="true" tooltip="hover" :piecewise="true"></vue-slider>
      </div>
      <div class="cell" style="grid-column: 4; grid-row: 1/3;">
        <span>Volume Airpodzi</span>
        <vue-slider :height="200" :width="4" :dotSize="20" :min="0" :max="4" :speed="0.3" :lazy="true" tooltip="hover" :piecewise="true" direction="vertical"></vue-slider>
      </div>
      <div class="cell" style="grid-column: 2/4; grid-row: 2/4;">
        <span>Meme grosso</span>
        <circle-slider
            :circle-width="20"
            :progress-width="10"
            :knob-radius="10"
            :min="0"
            :max="10"
            :side="150"
          ></circle-slider>
      </div>
      <div class="cell" style="grid-column: 2/5; grid-row: 4;">
        <span>FIFIFI</span>
        <div style="display: flex;">
          <push-button narrow class="red">0</push-button>
          <push-button narrow class="red">1</push-button>
          <push-button narrow class="red">2</push-button>
        </div>
      </div>
      <div class="cell" style="grid-column: 4; grid-row: 3;">
        <span>Porta aperta per Ascanio</span>
        <switches :type-bold="true" v-model="mem" color="blue" theme="custom"></switches>
      </div>
      <div class="cell" style="grid-column: 1; grid-row: 4;">
        <span>Livello di memaggine</span>
        <circle-slider
            :circle-width="10"
            :progress-width="5"
            :knob-radius="10"
          ></circle-slider>
      </div>
    </div>
  </div>
</template>

<script>
  import vueSlider from 'vue-slider-component'
  import Switches from 'vue-switches'

  export default {
    data () {
      return {
        commandTime: 10,
        progressBar: {
          progress: 100,
          intervalTime: 25
        },

        mem: false
      }
    },
    mounted () {
      this.updateProgressBar()
      setInterval(this.updateProgressBar, this.progressBar.intervalTime)
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
      }
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