<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="text-xs-center front-item">
    <v-menu
      bottom
      origin="center center"
      transition="slide-x-transition"
      offset-x
      offset-y
    >
      <template v-slot:activator="{ on }">
        <v-btn
          v-if="title"
          round
          fab
          color="blue-grey lighten-4"
          v-on="on"
        >
          <v-icon color="primary">apps</v-icon>
        </v-btn>
        <v-btn
          v-else
          round
          fab
          class="menu-button"
          color="blue-grey lighten-4"
          v-on="on"
        >
          <v-icon color="primary">apps</v-icon>
        </v-btn>
      </template>

      <v-list class="nav-menu">
        <v-layout column class="nav-menu">
          <v-btn
            round
            v-for="item in items"
            :key="item.title"
            @click="goToURL(item.url)"
            color="primary"
          >
            <v-list-tile-title><v-icon round style="margin-right: 10px">{{ item.icon }}</v-icon>{{ item.title }}</v-list-tile-title>
          </v-btn>
        </v-layout>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
  export default {
    name: "NavigationMenu",
    data: () => ({
      items: [
        {
          title: 'Home',
          url: '/',
          icon: 'home',
          loggedIn: true,
          loggedOut: true
        },
        {
          title: 'Search Venues',
          url: '/search',
          icon: 'search',
          loggedIn: true,
          loggedOut: true
        }
      ],
      title: false
    }),

    methods: {
      goToURL: function (URL) {
        this.$router.push(URL);
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../Resources/StyleSheets/variables";

  .menu-button {
    position: fixed;
    top: 30px;
    left: 30px;
  }

  .nav-menu {
    background-color: lightgrey;
    border-radius: 1em
  }

  .front-item {
    z-index: 10000;
  }


</style>
