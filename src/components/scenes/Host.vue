<template>
  <div id="host" class="menu-pane">
    <div>
      <h1 class="space-font pacchiano">Host game</h1>
      <div id="host-form" class="separated-container" v-if="!loading">
        Game name:
        <input class="input-field fluid separated" :class="{ 'error shake-animation': error }" v-model="name">
        <push-button @click="changeGameType()" :class="{ green: pub, orange: !pub }">
          <span><icon :name="gameTypeIcon"></icon></span>
          Match Type: {{ gameTypeReadable }}
        </push-button>
        <push-button bold @click="submit()">
          <span><icon name="gamepad"></icon></span>
          <span>Create game</span>
        </push-button>
        <push-button @click="$router.push('/')">
          <span><icon name="chevron-left"></icon></span>
          <span>Back</span>
        </push-button>
      </div>
      <div v-else>
        <div>
          <icon name="circle-o-notch" spin scale="3"></icon>
        </div>
        Game creation...
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        loading: false,
        name: '',
        pub: true,
        error: false
      }
    },
    methods: {
      submit () {
        if (this.name.length === 0) {
          this.error = true
        } else {
          this.error = false
          this.loading = true
          this.$io.emit('create_game', {
            name: this.name,
            'public': this.pub
          })
        }
      },
      changeGameType () {
        this.pub = !this.pub
      }
    },
    computed: {
      gameTypeIcon () {
        return this.pub ? 'unlock' : 'lock'
      },
      gameTypeReadable () {
        return this.pub ? 'Public' : 'Private'
      }
    }
  }
</script>

<style>
</style>
