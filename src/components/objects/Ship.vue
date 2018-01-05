<template>
  <div class="ship" :style="{ left, transition: 'left ' + transitionSpeed + 's' }">
    <img src="../../assets/ship-fire.png" class="fire">
    <img src="../../assets/ship.png" class="body">
  </div>
</template>

<script>
  export default {
    props: {
      left: {
        required: true
      },
      transitionSpeed: {
        required: false,
        default: 1
      }
    }
  }
</script>

<style>
  .ship {
    position: absolute;
    top: 50%;
    animation: intro-show-ship 1.5s ease-out forwards;
  }

  .ship>.body {
    transform: rotate(90deg);
    animation: intro-wiggle-ship 0.82s linear both infinite;
  }

  .ship>.fire {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 50%;
    transform: translate(-200%, -50%) rotate(90deg);
    z-index: -1;
    animation: intro-ship-fire-flicker 0.15s linear infinite alternate;
  }

  @keyframes intro-ship-fire-flicker {
    from { opacity: 0.5; }
    to { opacity: 1; }
  }

  @keyframes intro-wiggle-ship {
    10%, 90% {
      transform: translate3d(-2px, 2px, 0) rotate(91deg);
    }

    20%, 80% {
      transform: translate3d(2px, 2px, 0) rotate(89deg);
    }

    30%, 50%, 70% {
      transform: translate3d(-2px, 2px, 0) rotate(91deg);
    }

    40%, 60% {
      transform: translate3d(2px, -2px, 0) rotate(89deg);
    }
  }

  @keyframes intro-show-ship {
    from {
      transform: translate(-100%, -50%);

    }
    to {
      transform: translate(40%, -50%);
    }
  }

  @media screen and (max-width: 800px) {
    @keyframes intro-show-ship {
      from {
        transform: translate(-100%, -50%);
      }
      to {
        transform: translate(20%, -50%);
      }
    }
  }
</style>
