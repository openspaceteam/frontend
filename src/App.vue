<template>
  <div id="intro" class="space-font">
    <div class="top">
      <div class="ship">
        <img src="./assets/ship-fire.png" class="fire">
        <img src="./assets/ship.png" class="body">
      </div>
      <span>Settore 1</span>
    </div>
    <div class="bottom" v-if="printingWelcome">
      <icon class="alert-icon" name="exclamation-triangle" scale="4"></icon>
      <div class="text">
        <vue-typer
          :text="welcomeText"
          :repeat="0"
          :type-delay="30"
          :eraseOnComplete="true"
          class="space-mono-font"
          @completed='onComplete'
        ></vue-typer>
      </div>
      <img class="fast-forward" @click='onComplete' src="./assets/icons/fastForward.png">
    </div>
    <div class="bottom loading" v-if="!printingWelcome">
      <div><icon class="loading-icon" name="circle-o-notch" scale="3" spin></icon></div>
      <div class="space-mono-font"><span>Connessione in corso</span></div>
    </div>
  </div>
</template>

<script>
  import { VueTyper } from 'vue-typer'

  export default {
    name: 'app',
    data () {
      return {
        welcomeText: [
          'SITUAZIONE CRITICA!\n\n' +
          'La navicella non risponde ai comandi.\n' +
          'La situazione potrebbe peggiorare.\n' +
          'Possibili conseguenze catastrofiche.\n' +
          'Tentare di riprendere il controllo ad ogni costo.',

          'A TUTTO L\'EQUIPAGGIO\n' +
          'ATTENERSI AL SEGUENTE PROTOCOLLO:\n\n' +
          '+ Richiesta massima collaborazione;\n' +
          '+ Ogni giocatore possiede dei comandi diversi;\n' +
          '+ Ad ogni giocatore è assegnato un comando;\n' +
          '+ Comunicare il comando ad alta voce;\n' +
          '+ Il proprietario del comando è pregato di eseguirlo;\n' +
          '+ Eseguire i comandi entro il tempo limite;\n' +
          '\n\n' +
          'Buon divertimento!'
        ],
        printingWelcome: true
      }
    },
    methods: {
      onComplete () {
        console.log('beccowo')
        this.printingWelcome = false
      }
    },
    components: {
      VueTyper
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Bungee');
  @import url('https://fonts.googleapis.com/css?family=Space+Mono');

  html {
    height: 100%;
    background-image: url('./assets/black.png');
  }


  body {
    height: 100%;
    margin: 0 auto;
  }
  .space-font {
    font-family: 'Bungee', cursive;
  }

  .space-mono-font {
    font-family: 'Space Mono', monospace;
  }

  #intro {
    height: 100%;
    position: relative;
  }

  #intro>.top {
    height: 200px;
    color: white;
    position: relative;
    background: url('assets/darkPurple.png') 0 0 repeat;
    animation: move-intro-top-background 200s linear infinite;
  }

  @keyframes move-intro-top-background {
    from { background-position-x: 0; }
    to { background-position-x: 200%; }
  }

  .top>span {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 180%;
    text-shadow: 3px 0 0 #000, -3px 0 0 #000, 0 3px 0 #000, 0 -3px 0 #000, 1px 1px #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000;
  }

  .top>.ship {
    position: absolute;
    top: 50%;
    animation: intro-show-ship 1.5s ease-out forwards;
  }

  .ship>.fire {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 50%;
    transform: translate(-50%, 0%);
    z-index: -1;
    animation: intro-ship-fire-flicker 0.15s linear infinite alternate;
  }

  @keyframes intro-ship-fire-flicker {
    from {
      opacity: 0.5;
    }

    to {
      opacity: 1;
    }
  }

  @keyframes intro-show-ship {
    from {
      transform: translate(-100%, -50%) rotate(90deg);

    }
    to {
      transform: translate(40%, -50%) rotate(90deg);
    }
  }

  #intro>.bottom {
    width: 100%;
    height: calc(100% - 200px);
    background-color: black;
    color: white;
  }

  .bottom>.text {
    padding-top: 10px;
    font-size: 120%;
    text-align: center;
    margin: 0 auto;
  }

  .bottom>.alert-icon {
    padding-top: 25px;
    text-align: center;
    margin: 0 auto;
    display: block;
    color: #FCBF49;
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

  .vue-typer .custom.char.typed {
    color: white;
  }


  @media screen and (min-width: 799px) {
    body {
      width: 800px;
      border-left: 2px solid white;
      border-right: 2px solid white;
    }
  }

  @media screen and (max-width: 800px) {
    body {
      width: 100%;
    }

    .bottom>.text {
      font-size: 75%;
    }

    @keyframes intro-show-ship {
      from {
        transform: translate(-100%, -50%) rotate(90deg);

      }
      to {
        transform: translate(20%, -50%) rotate(90deg);
      }
    }
  }
</style>
