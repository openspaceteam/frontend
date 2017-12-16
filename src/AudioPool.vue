<template>
  <div>
    <div v-for="(sound, k) in sounds">
      <audio ref="sounds" :src="sound.url" @canplay="soundLoaded()"></audio>
    </div>
    <div v-for="(sound, idx) in playingSounds">
      <audio ref="playingSounds" :src="sound.url" :loop="sound.loop"></audio>
    </div>
  </div>
</template>

<script>
  import sounds from '@/sounds'

  export default {
    data () {
      return {
        sounds,
        playingSounds: [],
        soundsToLoad: -1
      }
    },
    created () {
      this.soundsToLoad = Object.keys(this.sounds).length
    },
    mounted () {
      this.$bus.$on('playSound', (sound) => {
        this.play(sound)
      })

      this.$bus.$on('stopSound', (sound) => {
        this.stop(sound)
      })

      this.$bus.$on('toggleSound', (sound) => {
        if (this.isPlaying(sound)) {
          this.stop(sound)
        } else {
          this.play(sound)
        }
      })

      setInterval(this.soundsCleanup, 5000)
    },
    methods: {
      soundLoaded () {
        this.soundsToLoad--
        if (this.soundsToLoad === 0) {
          this.$emit('loaded')
        }
      },
      play (sound) {
        if (this.playingSounds === undefined) {
          return
        }
        let idx = this.playingSounds.push(Object.assign({ name: sound }, this.sounds[sound]))
        this.$nextTick(() => {
          this.$refs.playingSounds[idx - 1].play()
        })
      },
      stop (sound) {
        if (this.playingSounds === undefined) {
          return
        }
        this.playingSounds.forEach((el, idx) => {
          if (el.name === sound) {
            this.$refs.playingSounds[idx].pause()
            this.$refs.playingSounds[idx].currentTime = 0
          }
        })
        this.soundsCleanup()
      },
      isPlaying (sound) {
        if (this.playingSounds === undefined) {
          return
        }
        let found = false
        this.playingSounds.some((el, idx) => {
          if (el.name === sound) {
            found = true
            return true
          }
        })
        return found
      },
      soundsCleanup () {
        if (this.$refs.playingSounds === undefined || this.$refs.playingSounds.length === 0) {
          return
        }
        this.$refs.playingSounds.forEach((el, idx) => {
          if (el.ended || (el.currentTime === 0 && el.paused)) {
            this.playingSounds.splice(idx, 1)
          }
        })
      }
    }
  }
</script>
