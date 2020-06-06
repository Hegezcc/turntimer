<template>
  <div id="app">
    <Game :players="2" :time="60" />
  </div>
</template>

<script>
import Game from './components/Game.vue'

export default {
  name: 'App',
  components: {
    Game
  }
}
</script>

<style>
</style>
