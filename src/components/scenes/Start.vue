<template>
  <div id="start" class="full-size both-centered">
    <div id="title" class="space-font pacchiano">
      Spaceteam
    </div>
    <div id="subtitle" class="space-font-mono">
      Simulatore collaborativo di disastri spaziali
    </div>
    <div class="actions">
      <div>
        <push-button @click.native="$router.push('/host')" class="space-font-mono">Ospita</push-button>
      </div>
      <div>
        <push-button class="space-font-mono">Unisciti</push-button>
      </div>
    </div>
    <icon @click.native="toggleMusic()" class="mute-icon" :name="playingMusic ? 'volume-down' : 'volume-off'" scale="5"></icon>
    <div id="footer" class="space-font-mono">
      <span>v0.1 ~ </span>
      <span>Realizzato da Giuseppe Guerra per l'ISIS Di Maggio ~ </span>
      <span>Stato server:</span>
      <icon name="check-circle"></icon>
    </div>
  </div>
</template>

<script>
  import PushButton from '@/components/objects/PushButton.vue'

  export default {
    data () {
      return {
        playingMusic: true
      }
    },
    components: {
      PushButton
    },
    mounted () {
//      this.$bus.$emit('playSound', 'menu')
    },
    methods: {
      toggleMusic () {
        this.$bus.$emit('toggleSound', 'menu')
        this.playingMusic = !this.playingMusic
      }
    }
  }
</script>

<style>
  html {
    animation: move-intro-top-background 2s linear infinite;
  }

  @keyframes move-intro-top-background {
    from { background-position-x: 0; }
    to { background-position-x: -200%; }
  }

  #start {
    color: white;
    /*opacity: 1;*/
    /*animation: start-fade-in 1.75s 0.5s ease-out forwards;*/
  }

  #title {
    height: 100px;
    margin-top: 200px;
    animation: title-animation 10s ease-in-out alternate infinite;
  }

  @keyframes title-animation {
    from {
      font-size: 500%;
      transform: rotate(3deg);
    }
    50% {
      font-size: 480%;
      transform: rotate(0);
    }
    to {
      font-size: 500%;
      transform: rotate(-3deg);
    }
  }

  #subtitle {
    font-size: 125%;
  }

  .actions {
    width: 50%;
    margin: 0 auto;
  }

  .actions>div {
    padding-top: 20px;
  }

  .mute-icon {
    position: absolute;
    right: 0;
    bottom: 0;
    margin: 40px;
  }

  #footer {
    position: absolute;
    bottom: 0;
    text-align: center;
    width: 100%;
    margin-bottom: 20px;
    font-size: 80%;
    font-weight: bold;
  }

  #footer>svg {
    vertical-align: middle;
    color: greenyellow;
  }

  @keyframes start-fade-in {
    from {
      opacity: 0;
      padding-top: 30px;
    }
    100% {
      opacity: 1;
      padding-top: 0;
    }
  }

  @media screen and (max-width: 800px) {
    .actions {
      width: 100%;
    }
  }
</style>
