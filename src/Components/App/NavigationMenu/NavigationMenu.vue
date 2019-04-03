<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="text-xs-center">
    <v-menu
      bottom
      origin="center center"
      transition="slide-x-transition"
      offset-x
      offset-y
    >
      <template v-slot:activator="{ on }">
        <v-btn
          round
          fab
          class="menu-button"
          dark
          v-on="on"
        >
          <v-icon>apps</v-icon>
        </v-btn>
      </template>

      <v-list style="background-color: lightgrey; border-radius: 1em">
        <v-layout column style="border-radius: 1em">
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
          title: 'Profile',
          url: '/profile',
          icon: 'dashboard',
          loggedIn: true,
          loggedOut: false
        },
        {
          title: 'My Venues',
          url: '/venues',
          icon: 'local_bar',
          loggedIn: true,
          loggedOut: true
        },
        {
          title: '',
          url: '',
          icon: '',
          loggedIn: true,
          loggedOut: true
        }
      ]
    })
  }
</script>

<style scoped>

  .menu-button {
    position: fixed;
    top: 30px;
    left: 30px;
  }


</style>
