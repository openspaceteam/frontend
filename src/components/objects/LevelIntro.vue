<template>
  <div id="level-intro">
    <icon v-if="alert" class="icon alert" name="exclamation-triangle" scale="4"></icon>
    <icon v-else class="icon success" name="check-circle" scale="4"></icon>
    <div class="text space-font-mono" v-html="unescapeSymbols(text)">
    </div>
  </div>
</template>


<script>
  import SymbolsMixin from '@/symbols.js'

  export default {
    props: {
      text: {
        required: true,
        type: String
      },
      alert: {
        required: false,
        type: Boolean,
        default: false
      }
    },
    mounted () {
      setTimeout(() => {
        if (this.alert) {
          this.playSound('sounds/modifier.mp3')
        } else {
          this.playSound('sounds/no_modifier.mp3')
        }
      }, 1000)
    },
    mixins: [SymbolsMixin]
  }
</script>

<style>
  #level-intro {
    text-align: center;
    margin-top: 25%;
  }

  #level-intro>.text {
    padding-top: 10px;
    font-size: 120%;
    text-align: center;
    margin: 0 auto;
  }

  #level-intro>.icon {
    padding-top: 25px;
    text-align: center;
    margin: 0 auto;
    display: block;
  }
  
  #level-intro>.alert {
    color: #FCBF49;
  }

  #level-intro>.success {
    color: #48fc8d;
  }

  @media screen and (max-width: 800px) {
    #level-intro>.text {
      font-size: 75%;
    }
  }
</style>

