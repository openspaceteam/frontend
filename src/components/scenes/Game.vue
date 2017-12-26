<template>
  <div id="intro" class="space-font">
    <div class="top" :class="{ large: !inGame, small: inGame }">
      <ship></ship>
      <span class="outline" v-if="printingWelcome">Settore 1</span>
    </div>
    <div class="bottom" v-if="printingWelcome">
      <welcome-text @completed="printingWelcome = false"></welcome-text>
      <icon class="fast-forward" @click.native='printingWelcome = false' name="forward" scale="2"></icon>
    </div>
    <div class="bottom loading" v-else-if="!printingWelcome && !inGame">
      <div><icon class="loading-icon" name="circle-o-notch" scale="3" spin></icon></div>
      <div class="space-font-mono"><span>Connessione in corso</span></div>
    </div>
    <div class="bottom" v-else-if="inGame && !printingWelcome">
      <instructions></instructions>
    </div>
  </div>
</template>

<script>
  import Ship from '@/components/objects/Ship.vue'
  import WelcomeText from '@/components/objects/WelcomeText.vue'
  import Instructions from '@/components/objects/Instructions.vue'

  export default {
    data () {
      return {
        printingWelcome: true,
        inGame: false
      }
    },
    components: {
      Ship,
      WelcomeText,
      Instructions
    },
    mounted () {
      this.playBgm('static/music/ship_engine.mp3')
      setTimeout(() => {
        this.printingWelcome = false
        this.inGame = true
      }, 5000)
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
</style>
