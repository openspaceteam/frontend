<template>
  <div id="main">
    <audio-pool @loaded="loading=false"></audio-pool>
    <div id="router-view" v-if="!loading">
      <transition name="change-menu-page-backward">
        <router-view></router-view>
      </transition>
    </div>
    <loading v-else></loading>
  </div>
</template>

<script>
  import AudioPool from '@/AudioPool.vue'
  import Loading from '@/components/scenes/Loading.vue'

  export default {
    data () {
      return {
        loading: true
      }
    },
    components: {
      AudioPool,
      Loading
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Bungee');
  @import url('https://fonts.googleapis.com/css?family=Space+Mono');

  html {
    background-image: url('./assets/black.png');
    height: 100%;
    overflow: hidden;

    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  body {
    height: 100%;
    margin: 0 auto;
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
    transform: translate(-50%, -50%) scale(0.8) !important;
  }
  .change-menu-page-backward-leave-active {
    /*left: 40% !important;*/
    transform: translate(-50%, -50%) scale(0.8) !important;
  }



  .both-centered {
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .full-size {
    width: 100%;
    height: 100%;
  }

  h1 {
    font-size: 300%;
  }

</style>
