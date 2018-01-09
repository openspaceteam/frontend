<template>
  <div id="welcome-text">
    <icon class="alert-icon" name="exclamation-triangle" scale="4"></icon>
    <div class="text">
      <vue-typer
        :text="welcomeText"
        :repeat="0"
        :type-delay="45"
        :eraseOnComplete="true"
        class="space-font-mono"
        @completed='$emit("completed")'
      ></vue-typer>
    </div>
  </div>
</template>

<script>
  import { VueTyper } from 'vue-typer'
  import MorseNode from '@/morse.js'

  export default {
    data () {
      return {
        welcomeText: [
          'SITUAZIONE CRITICA!\n' +
          'ATTENERSI AL SEGUENTE PROTOCOLLO:\n\n' +
          '+ Ogni giocatore possiede dei comandi diversi;\n' +
          '+ Ad ogni giocatore è assegnato un\'istruzione;\n' +
          '+ Comunicare l\'istruzione ad alta voce;\n' +
          '+ Chi possiede il comando relativo ad un\'istruzione è pregato di eseguirla;\n' +
          '+ Eseguire le istruzioni entro il tempo limite;\n',

          'La collaborazione è fondamentale\n' +
          'Ricordati di lavorare come una squadra\n' +
          'Come un vero Spaceteam.\n\n' +
          'Buon divertimento!'
        ]
      }
    },
    components: {
      VueTyper
    },
    mounted () {
      // let ac = this.$store.getters.audioContext
      // let morse = new MorseNode(ac, 35, 0.01)
      // morse.connect(ac.destination)
      // morse.playString(ac.currentTime, 'Il pane sas è molto digeribile i memi colorati con le zampe d avanti col becco woowoo')
    }
  }
</script>

<style>
  #welcome-text {
    text-align: center;
  }

  #welcome-text>.text {
    padding-top: 10px;
    font-size: 120%;
    text-align: center;
    margin: 0 auto;
  }

  #welcome-text>.alert-icon {
    padding-top: 25px;
    text-align: center;
    margin: 0 auto;
    display: block;
    color: #FCBF49;
  }

  @media screen and (max-width: 800px) {
    #welcome-text>.text {
      font-size: 75%;
    }
  }
</style>
