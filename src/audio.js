let bgm = null

export default {
  methods: {
    playBgm (path) {
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
      if (bgm !== null) {
        bgm.currentTime = 0
        bgm.pause()
        bgm = null
      }
    },
    isBgmPlaying () {
      return bgm !== null && !bgm.paused
    },
    playSound (path) {
      (new Audio('/static/' + path)).play()
    }
  }
}
