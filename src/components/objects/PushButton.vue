<template>
  <div class="btn-push"
       :class="{ big, small, disabled, enabled, fitted, inline, empty, narrow }"
       @mousedown="mouseDown()"
       @mouseup="mouseUp()"
       @click="click()"
  >
    <span :class="{ big, small, bold, grid }">
      <slot></slot>
    </span>
  </div>
</template>

<script>
  export default {
    methods: {
      mouseDown () {
        if (!this.disabled) {
          this.playSound(this.downSound)
        }
      },
      mouseUp () {
        if (!this.disabled) {
          this.playSound(this.upSound)
        }
      },
      click () {
        if (!this.disabled) {
          this.$emit('click')
        }
      }
    },
    props: {
      big: {
        type: Boolean,
        required: false,
        default: false
      },
      small: {
        type: Boolean,
        required: false,
        default: false
      },
      bold: {
        type: Boolean,
        required: false,
        default: false
      },
      disabled: {
        type: Boolean,
        required: false,
        default: false
      },
      fitted: {
        type: Boolean,
        required: false,
        default: false
      },
      narrow: {
        type: Boolean,
        required: false,
        default: false
      },
      inline: {
        type: Boolean,
        required: false,
        default: false
      },
      grid: {
        type: Boolean,
        required: false,
        default: false
      },
      empty: {
        type: Boolean,
        required: false,
        default: false
      },
      downSound: {
        type: String,
        required: false,
        default: 'sounds/button_down.mp3'
      },
      upSound: {
        type: String,
        required: false,
        default: 'sounds/button_up.mp3'
      }
    },
    computed: {
      enabled () {
        return !this.disabled
      }
    }
  }
</script>

<style>
  .btn-push>span {
    line-height: 1;
  }

  .btn-push>span.big {
    font-size: 25px;
  }
  .btn-push>span.small {
    font-size: 12px;
  }

  .btn-push.disabled {
    opacity: 0.3;
  }

  .btn-push.big {
    padding: 15px 50px;
  }

  .btn-push.small {
    padding: 0px 50px;
  }

  .btn-push>span>span:nth-child(1) {
    vertical-align: middle;
  }

  .btn-push.fitted {
    padding: 0 24px 0 24px;
    width: fit-content;
    margin: 0 auto;
  }

  .btn-push.narrow {
    padding: 8px 24px 8px 24px;
    margin: 0 auto;
    text-align: center;
  }

  .btn-push.empty {
    width: 60px;
    height: 60px;
    padding: 0;
  }

  .btn-push.inline {
    display: inline-block;
  }

  .btn-push {
    position: relative;
    top: 0;
    font-size: 16px;
    text-decoration: none;
    background: #f7f7f7;
    /*margin: 0 10px;*/
    padding: 5px 50px;
    border: 1px solid #c4c4c4;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    -webkit-box-shadow: 0px 5px 0px #c4c4c4;
    -moz-box-shadow: 0px 5px 0px #c4c4c4;
    -ms-box-shadow: 0px 5px 0px #c4c4c4;
    -o-box-shadow: 0px 5px 0px #c4c4c4;
    box-shadow: 0px 5px 0px #c4c4c4;
    color: #222;
    text-shadow: 1px 1px 1px #fff;
    -webkit-transition: All 250ms ease;
    -moz-transition: All 250ms ease;
    -o-transition: All 250ms ease;
    -ms-transition: All 250ms ease;
    transition: All 250ms ease;
    cursor: pointer;
  }
  /*==========  Active State  ==========*/
  .btn-push.enabled:active {
    position: relative;
    top: 5px;
    -webkit-box-shadow: none !important;
    -moz-box-shadow: none !important;
    -ms-box-shadow: none !important;
    -o-box-shadow: none !important;
    box-shadow: none !important;
    -webkit-transition: All 250ms ease;
    -moz-transition: All 250ms ease;
    -o-transition: All 250ms ease;
    -ms-transition: All 250ms ease;
    transition: All 250ms ease;
  }
  /*==========  Navy  ==========*/
  .btn-push.navy {
    background: #1b486d;
    border: 1px solid #07121b;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    -webkit-box-shadow: 0px 5px 0px #07121b;
    -moz-box-shadow: 0px 5px 0px #07121b;
    -ms-box-shadow: 0px 5px 0px #07121b;
    -o-box-shadow: 0px 5px 0px #07121b;
    box-shadow: 0px 5px 0px #07121b;
    color: #fff;
    text-shadow: 1px 1px 1px #07121b;
  }
  /*==========  Green  ==========*/
  .btn-push.green {
    background: #7cc576;
    color: #fff;
    border: 1px solid #46963f;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    -webkit-box-shadow: 0px 5px 0px #46963f;
    -moz-box-shadow: 0px 5px 0px #46963f;
    -ms-box-shadow: 0px 5px 0px #46963f;
    -o-box-shadow: 0px 5px 0px #46963f;
    box-shadow: 0px 5px 0px #46963f;
    text-shadow: 1px 1px 1px #46963f;
  }
  /*==========  Red  ==========*/
  .btn-push.red {
    background: #df4242;
    color: #fff;
    border: 1px solid #a01b1b;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    -webkit-box-shadow: 0px 5px 0px #a01b1b;
    -moz-box-shadow: 0px 5px 0px #a01b1b;
    -ms-box-shadow: 0px 5px 0px #a01b1b;
    -o-box-shadow: 0px 5px 0px #a01b1b;
    box-shadow: 0px 5px 0px #a01b1b;
    text-shadow: 1px 1px 1px #a01b1b;
  }
  /*==========  Blue  ==========*/
  .btn-push.blue {
    background: #2ec2dd;
    color: #fff;
    border: 1px solid #177c8e;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    -webkit-box-shadow: 0px 5px 0px #177c8e;
    -moz-box-shadow: 0px 5px 0px #177c8e;
    -ms-box-shadow: 0px 5px 0px #177c8e;
    -o-box-shadow: 0px 5px 0px #177c8e;
    box-shadow: 0px 5px 0px #177c8e;
    text-shadow: 1px 1px 1px #177c8e;
  }
  /*==========  Orange  ==========*/
  .btn-push.orange {
    background: #f57936;
    color: #fff;
    border: 1px solid #bc4809;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    -webkit-box-shadow: 0px 5px 0px #bc4809;
    -moz-box-shadow: 0px 5px 0px #bc4809;
    -ms-box-shadow: 0px 5px 0px #bc4809;
    -o-box-shadow: 0px 5px 0px #bc4809;
    box-shadow: 0px 5px 0px #bc4809;
    text-shadow: 1px 1px 1px #bc4809;
  }

  @media screen and (max-width: 800px) {
    .btn-push>span.big {
      font-size: 20px;
    }
  }

  @media screen and (max-width: 1400px) {
    .btn-push.narrow {
      padding: 4px 12px 4px 12px;
    }

    .btn-push>span.grid {
      display: grid;
    }
  }

</style>
