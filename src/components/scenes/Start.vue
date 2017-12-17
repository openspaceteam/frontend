<template>
  <div id="start" class="full-size both-centered">
    <div id="title" class="space-font pacchiano">
      Spaceteam
    </div>
    <div class="actions separated-container">
      <div id="subtitle" class="space-font-mono">
        Simulatore collaborativo di disastri spaziali
      </div>
      <push-button @click="$router.push('/host')" class="space-font-mono" big :disabled="!connected">Ospita</push-button>
      <push-button @click="$router.push('/join')" class="space-font-mono" big :disabled="!connected">Unisciti</push-button>
    </div>
    <icon @click.native="toggleMusic()" class="mute-icon" :name="playingMusic ? 'volume-down' : 'volume-off'" scale="3"></icon>
    <div id="footer" class="space-font-mono">
      <span>v0.1 ~ </span>
      <span>Realizzato da Giuseppe Guerra per l'ISIS Di Maggio ~ </span>
      <span>Stato server:</span>
      <icon v-if="connecting" name="spinner" class="connecting" pulse></icon>
      <icon v-else-if="connected && !connecting" class="online" name="check-circle"></icon>
      <icon v-else-if="!connected && !connecting" class="offline" name="unlink"></icon>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        playingMusic: this.isBgmPlaying(),
        connected: false,
        connecting: true
      }
    },
    mounted () {
      if (!this.$store.getters.menuMusicInitialized) {
//        this.playBgm('static/music/menu.wav')
        this.$store.commit('menuMusicInitialized')
      }
      setTimeout(() => {
        this.connected = true
        this.connecting = false
      }, 1000)
    },
    methods: {
      toggleMusic () {
        if (this.isBgmPlaying()) {
          this.stopBgm()
        } else {
          this.playBgm('static/music/menu.wav')
        }
        this.playingMusic = this.isBgmPlaying()
      }
    }
  }
</script>

<style>
  #start {
    color: white;
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
  }

  #footer>.online {
    color: greenyellow;
  }
  #footer>.connecting {
    color: cornflowerblue;
  }
  #footer>.offline {
    color: yellow;
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
      width: 95%;
    }

    #title {
      height: 70px;
      margin-top: 150px;
    }

    #subtitle {
      font-size: 80%;
    }

    @keyframes title-animation {
      from {
        font-size: 350%;
        transform: rotate(3deg);
      }
      50% {
        font-size: 330%;
        transform: rotate(0);
      }
      to {
        font-size: 350%;
        transform: rotate(-3deg);
      }
    }
  }
</style>
