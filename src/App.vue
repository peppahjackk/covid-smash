<template>
  <div id="app">
    <div v-if="$root.store.User.name" class="banner">
      <p>Welcome back {{ $root.store.User.name }}! <span class="underline" @click="resetUser">Not you?</span></p>
      </div>
    <Dashboard></Dashboard>
    <Login v-if="!$root.store.User.name"></Login>
  </div>
</template>

<script>
import Dashboard from './views/pages/Dashboard.vue';
import Login from './views/components/Login';
import uuidv4 from 'uuid/v4';

export default {
  name: 'App',
  mounted: function() {
    let theUser = JSON.parse(localStorage.getItem('brosUser'));

    if (!theUser) {
      theUser = {
        id: uuidv4(), // unique id given to the user for db identification
        name: null,
        venmo: null
      }
    }

    this.$root.store.User = theUser;
  },
  methods: {
    // TODO move this to a mixin or something
    resetUser: function() {
      this.$root.store.User.name = null;
      this.$root.store.User.venmo = null;
      this.$root.store.User.id = null;

      localStorage.setItem('brosUser', JSON.stringify(this.$root.store.User));
      
      // TODO move 
      // location.reload();
    }
  },
  components: {
    Dashboard,
    Login
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
