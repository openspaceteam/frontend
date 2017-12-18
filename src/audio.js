let bgm = null

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
    playSound (path) {
      // Play arbitrary, non-looping sound
      (new Audio('/static/' + path)).play()
    }
  }
}
