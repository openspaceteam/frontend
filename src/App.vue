<template>
  <div id="main">
    <div id="router-view" v-if="!loading">
      <transition name="change-menu-page-backward">
        <router-view></router-view>
      </transition>
    </div>
    <loading v-else></loading>
  </div>
</template>

<script>
  import Loading from '@/components/scenes/Loading.vue'

  export default {
    data () {
      return {
        loading: false
      }
    },
    components: {
      Loading
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Bungee');
  @import url('https://fonts.googleapis.com/css?family=Space+Mono');

  @keyframes move-intro-top-background {
    from { background-position-x: 0; }
    to { background-position-x: -200%; }
  }

  html {
    animation: move-intro-top-background 2s linear infinite;
    background-image: url('./assets/black.png');
    height: 100%;
    /* overflow: hidden; */

    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  body {
    height: 100%;
    margin: 0 auto;
    /* overflow: hidden; */
  }
  .space-font {
    font-family: 'Bungee', cursive;
  }

  .space-font-mono {
    font-family: 'Space Mono', monospace;
  }

  .outline, .pacchiano {
    text-shadow: 3px 0 0 #000, -3px 0 0 #000, 0 3px 0 #000, 0 -3px 0 #000, 1px 1px #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000;
  }

  #main, #router-view {
    height: 100%;
  }

  .change-menu-page-forward-enter-active,
  .change-menu-page-forward-leave-active,
  .change-menu-page-backward-enter-active,
  .change-menu-page-backward-leave-active {
    transition: all 0.5s !important;
  }
  .change-menu-page-forward-enter,
  .change-menu-page-forward-leave-active,
  .change-menu-page-backward-enter,
  .change-menu-page-backward-leave-active{
    opacity: 0 !important;
  }
  .change-menu-page-forward-enter {
    right: 40% !important;
  }
  .change-menu-page-forward-leave-active {
    left: 40% !important;
  }

  .change-menu-page-backward-enter {
    /*right: 40% !important;*/
    transform: scale(0.8) !important;
  }
  .change-menu-page-backward-leave-active {
    /*left: 40% !important;*/
    transform: scale(0.8) !important;
  }



  .both-centered {
    margin: auto;
    position: absolute;
    top: 0; left: 0; bottom: 0; right: 0;
    text-align: center;
  }

  .full-size {
    width: 100%;
    height: 100%;
  }

  h1 {
    font-size: 300%;
  }

  input.input-field {
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    border: 1px solid #C2C2C2;
    box-shadow: 0 0 3px #EBEBEB;
    -moz-box-shadow: 0 0 3px #EBEBEB;
    -webkit-box-shadow: 0 0 3px #EBEBEB;
    border-radius: 3px;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    padding: 7px;
    outline: none;
    font-family: 'Space Mono', monospace;
  }
  .input-field:focus {
    border: 1px solid #37474f;
  }
  .input-field.error {
    border: 1px solid #d32f2f;
    box-shadow: 0 0 3px #d32f2f;
    -moz-box-shadow: 0 0 3px #d32f2f;
    -webkit-box-shadow: 0 0 3px #d32f2f;
    background-color: #ef9a9a;
  }
  @keyframes shake {
    10%, 90% {
      transform: translate3d(-1px, 0, 0);
    }

    20%, 80% {
      transform: translate3d(2px, 0, 0);
    }

    30%, 50%, 70% {
      transform: translate3d(-4px, 0, 0);
    }

    40%, 60% {
      transform: translate3d(4px, 0, 0);
    }
  }
  .shake-animation {
    animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
    perspective: 1000px;
  }
  .bold {
    font-weight: bold;
  }
  .fluid {
    width: 100%;
  }

  ::-webkit-scrollbar {
    width: 6px;
    background-color: #000000;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #F5F5F5;
  }

  .separated {
    margin-bottom: 15px;
  }

  .menu-pane {
    color: white;
    padding-top: 300px;
    width: 40%;
    height: 100%;
    margin: auto;
    position: absolute;
    top: 0; left: 0; bottom: 0; right: 0;
    text-align: center;
    font-family: 'Space Mono', monospace;
  }

  .separated-container>* {
    margin-bottom: 15px;
  }

  .clearfix::after {
    clear: both;
    display: table;
    content: "";
  }

  .fader {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: white;
    z-index: 10000;
    animation: fade-in forwards;
    animation-duration:  2.2s;
  }

  .v-fade-enter-active, .v-fade-leave-active {
    transition: opacity .5s;
  }
  .v-fade-enter, .v-fade-leave-to {
    opacity: 0;
  }

  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @media screen and (max-width: 800px) {
    .menu-pane {
      padding-top: 100px;
      width: 95%;
    }

    h1 {
      font-size: 200%;
    }
  }

  .vue-typer .custom.char.typed {
    color: white;
  }


</style>
