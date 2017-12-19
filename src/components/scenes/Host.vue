<template>
  <div id="host" class="menu-pane">
    <div>
      <h1 class="space-font pacchiano">Ospita partita</h1>
      <div id="host-form" class="separated-container" v-if="!loading">
        Nome partita:
        <input class="input-field fluid separated" :class="{ 'error shake-animation': error }" v-model="name">
        <push-button @click="changeGameType()" :class="{ green: pub, orange: !pub }">
          <span><icon :name="gameTypeIcon"></icon></span>
          Tipo partita: {{ gameTypeReadable }}
        </push-button>
        <push-button bold @click="submit()">
          <span><icon name="gamepad"></icon></span>
          <span>Crea partita</span>
        </push-button>
        <push-button @click="$router.push('/')">
          <span><icon name="chevron-left"></icon></span>
          <span>Indietro</span>
        </push-button>
      </div>
      <div v-else>
        <div>
          <icon name="circle-o-notch" spin scale="3"></icon>
        </div>
        Creazione partita...
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
        return this.pub ? 'Pubblica' : 'Privata'
      }
    }
  }
</script>

<style>
</style>
