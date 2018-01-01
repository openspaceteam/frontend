let bgm = null

let loopingSounds = {}

export default {
  methods: {
    playBgm (path) {
      // Don't play another bgm if there's already one playing
      if (bgm === null) {
        bgm = new Audio(path)
        bgm.addEventListener('ended', function () {
          this.currentTime = 0
          this.play()
        }, false)
        bgm.play()
      }
    },
    stopBgm () {
      // Stops the bgm if there's one playing
      if (bgm !== null) {
        bgm.currentTime = 0
        bgm.pause()
        bgm = null
      }
    },
    isBgmPlaying () {
      // Checks if there's a bgm playing
      return bgm !== null && !bgm.paused
    },
    playSound (path, loop) {
      let shouldLoop = loop !== undefined && loop
      if (shouldLoop && loopingSounds.hasOwnProperty(path.toLowerCase())) {
        // Looping sound already playing
        return
      }

      // Play arbitrary sound
      let audio = new Audio('/static/' + path)
      if (shouldLoop) {
        audio.addEventListener('ended', function () {
          this.currentTime = 0
          this.play()
        }, false)
      }
      audio.play()

      // Register looping sound
      if (shouldLoop) {
        loopingSounds[path.toLowerCase()] = audio
      }
    },
    stopSound (path, fadeTime) {
      // Stops a looping sound
      if (!loopingSounds.hasOwnProperty(path.toLowerCase())) {
        return
      }
      let sound = loopingSounds[path.toLowerCase()]
      if (fadeTime !== undefined) {
        let startVolume = sound.volume
        let intervalDecrement = (startVolume / fadeTime) * 100
        let fadeInterval = setInterval(() => {
          if (sound.volume - intervalDecrement <= 0) {
            clearInterval(fadeInterval)
            this.stopSound(path)
          } else {
            sound.volume -= intervalDecrement
          }
        }, 100)
      } else {
        sound.currentTime = 0
        sound.pause()
        delete loopingSounds[path.toLowerCase()]
      }
    }
  }
}
