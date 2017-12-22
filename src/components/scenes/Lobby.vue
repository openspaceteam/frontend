<template>
  <div id="lobby" class="menu-pane">
    <div>
      <h1 class="space-font pacchiano">Lobby</h1>
      <div>
        <div class="separated-container slot" v-for="(slot, index) in slots" :class="{ green: slot.ready }">
          <div>
            <push-button small fitted>
              X
            </push-button>
          </div>
          <div>
            <div class="name" :disabled="!slot.hasOwnProperty('ready')">
              <span>
                <icon :name="slot.host ? 'bolt' : 'gamepad'" v-if="slot.hasOwnProperty('ready')"></icon>
                <icon name="spinner" pulse v-else></icon>
              </span>
              <span v-if="slot.hasOwnProperty('ready')">
                Giocatore {{ index + 1 }}
              </span>
              <span v-else>
                In attesa...
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      slots: [
        { host: true, ready: false },
        { host: false, ready: false },
        {}, {}
      ]
    }
  }
}
</script>

<style>
  .slot>div:first-child {
    display: inline-block;
    left: 0;
    position: absolute;
    width: 16px;
  }

  .slot>div:last-child {
    display: inline-block;
    vertical-align: middle;
    background-color: black;
    width: 100%;
    padding: 4px 0 4px 0;
    vertical-align: middle;
    text-align: center;
  }
</style>



