// Copyright 2014–2017, Eric Holk
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

export default class MorseNode {
  MORSE = {
    'A': '.-',
    'B': '-...',
    'C': '-.-.',
    'D': '-..',
    'E': '.',
    'F': '..-.',
    'G': '--.',
    'H': '....',
    'I': '..',
    'J': '.---',
    'K': '-.-',
    'L': '.-..',
    'M': '--',
    'N': '-.',
    'O': '---',
    'P': '.--.',
    'Q': '--.-',
    'R': '.-.',
    'S': '...',
    'T': '-',
    'U': '..-',
    'V': '...-',
    'W': '.--',
    'X': '-..-',
    'Y': '-.--',
    'Z': '--..',
    '1': '.----',
    '2': '..---',
    '3': '...--',
    '4': '....-',
    '5': '.....',
    '6': '-....',
    '7': '--...',
    '8': '---..',
    '9': '----.',
    '0': '-----'
  }

  constructor (ac, rate, volume) {
    // ac is an audio context.
    this._oscillator = ac.createOscillator()
    this._gain = ac.createGain()

    this._gain.gain.value = 0
    this._oscillator.frequency.value = 750

    this._oscillator.connect(this._gain)

    if (rate === undefined) {
      rate = 20
    }
    this._dot = 1.2 / rate // formula from Wikipedia.
    if (volume === undefined) {
      volume = 1.0
    }
    this._volume = volume

    this._oscillator.start(0)
  }

  connect (target) {
    return this._gain.connect(target)
  }

  playChar (t, c) {
    for (let i = 0; i < c.length; i++) {
      switch (c[i]) {
        case '.':
          this._gain.gain.setValueAtTime(this._volume, t)
          t += this._dot
          this._gain.gain.setValueAtTime(0.0, t)
          break
        case '-':
          this._gain.gain.setValueAtTime(this._volume, t)
          t += 3 * this._dot
          this._gain.gain.setValueAtTime(0.0, t)
          break
      }
      t += this._dot
    }
    return t
  }

  playString (t, w) {
    w = w.toUpperCase()
    for (let i = 0; i < w.length; i++) {
      if (w[i] === ' ') {
        // 3 dots from before, three here, and
        // 1 from the ending letter before.
        t += 3 * this._dot
      } else if (this.MORSE[w[i]] !== undefined) {
        t = this.playChar(t, this.MORSE[w[i]])
        t += 2 * this._dot
      }
    }
    return t
  }
}
