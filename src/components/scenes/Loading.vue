<template>
  <div id="loading" class="space-font-mono">
    <div><icon name="cog" spin scale="3"></icon></div>
    Downloading data
  </div>
</template>

<script>
  export default {}
</script>

<style>
  #loading {
    color: white;
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>
