<template>
  <div id="join-private" class="menu-pane">
    <div>
      <h1 class="space-font pacchiano">Private match</h1>
      <div v-if="!loading" class="separated-container">
        Invitation code:
        <div>
          <input type="password" class="input-field fluid" :class="{ 'error shake-animation': error }" v-model="code">
        </div>
        <push-button @click="join()" class="orange">
          <span><icon name="sign-in"></icon></span>
          Sign in
        </push-button>
        <push-button bold @click="$router.push('/join')">
          <span><icon name="chevron-left"></icon></span>
          Back
        </push-button>
      </div>
      <div id="join-private-loading" v-else>
        <div>
          <icon name="key" :pulse="!d" :class="{ done: d }" scale="3"></icon>
          <icon :name="d ? 'unlock-alt' : 'lock'" class="rotated" scale="3"></icon>
        </div>
        Access the game...
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        code: '',
        loading: false,
        error: false,

        d: false
      }
    },
    methods: {
      join () {
        if (this.code.length === 0) {
          this.error = true
        } else {
          this.loading = true
          setTimeout(() => {
            this.d = true
            this.playSound('sounds/unlock.mp3')
          }, 1242)
        }
      }
    }
  }
</script>

<style>
  #join-private {
    color: white;
  }

  #join-private-loading>div>svg:first-child.done {
    animation: lock-in-padlock 0.25s ease-in-out forwards;
  }

  @keyframes lock-in-padlock {
    100% { transform: translateX(24px) rotate(-45deg); }
  }

  #join-private-loading>div>svg:first-child {
    color: goldenrod;
  }

  #join-private-loading>div>svg:nth-child(2) {
    transform: rotate(90deg);
  }
</style>
