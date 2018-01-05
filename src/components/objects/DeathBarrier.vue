<template>
  <div id="death-barrier">
    <!-- <div class="padding"></div> :style="{ width: position + '%', left: position }" -->
    <img src="../../assets/death-barrier.png" :style="{ width: (position + 10) + '%'}">
  </div>
</template>

<script>
  export default {
    props: {
      position: {
        required: true
      }
    }
  }
</script>

<style>
  #death-barrier {
    position: absolute;
    height: 100%;
    display: flex;
    width: 100%;
    z-index: 2;
  }

  #death-barrier>img {
    animation: death-barrier-flicker 5s infinite;
    transition: width 2s;
  }

  #death-barrier>.padding {
    background-image: url('../../assets/death-barrier-padding.png');
    background-repeat: repeat;
    width: 100%;
    height: 100%;
  }

  @keyframes death-barrier-flicker {
    from { opacity: 1 }
    50% { opacity: 0.75 }
    to { opacity: 1 }
  }
</style>


