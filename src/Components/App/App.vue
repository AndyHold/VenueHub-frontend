<template>
  <v-app id="app">
    <navigation-menu></navigation-menu>
    <router-view></router-view>
  </v-app>
</template>

<script>
import NavigationMenu from "./NavigationMenu/NavigationMenu";
export default {
  name: 'app',
  components: {NavigationMenu},
  data () {
    return {}
  }
}
</script>

<style>

</style>
