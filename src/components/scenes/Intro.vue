<template>
  <div id="intro" class="space-font">
    <div class="top">
      <ship></ship>
      <span class="outline">Settore 1</span>
    </div>
    <div class="bottom" v-if="printingWelcome">
      <welcome-text @completed="printingWelcome = false"></welcome-text>
      <img class="fast-forward" @click='printingWelcome = false' src="assets/icons/fastForward.png">
    </div>
    <div class="bottom loading" v-if="!printingWelcome">
      <div><icon class="loading-icon" name="circle-o-notch" scale="3" spin></icon></div>
      <div class="space-font-mono"><span>Connessione in corso</span></div>
    </div>
  </div>
</template>

<script>
  import Ship from '@/components/objects/Ship.vue'
  import WelcomeText from '@/components/objects/WelcomeText.vue'

  export default {
    data () {
      return {
        printingWelcome: true
      }
    },
    components: {
      Ship,
      WelcomeText
    },
    mounted () {
      this.playBgm('static/music/ship_engine.mp3')
    }
  }
</script>

<style>
  #intro {
    height: 100%;
    position: relative;
    overflow: hidden;
    margin: 0 auto;
  }

  #intro>.top {
    height: 200px;
    color: white;
    position: relative;
    background: url('../../assets/darkPurple.png') 0 0 repeat;
    animation: move-intro-top-background 200s linear infinite;
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
  }

  #intro>.bottom {
    width: 100%;
    height: calc(100% - 200px);
    background-color: black;
    color: white;
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
    transform: scale(0.5);
    position: absolute;
    right: 0;
    bottom: 0;
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
</style>
