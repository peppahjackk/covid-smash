<template>
  <div id="app">
    <div v-if="$root.store.User.name" class="banner">
      <p>Welcome back {{ $root.store.User.name }}! <span class="underline" @click="resetUser">Not you?</span></p>
      </div>
    <Dashboard></Dashboard>
    <Admin></Admin>
    <NewMatch v-if="activeModal === 'newMatch'"></NewMatch>
    <Login v-if="!$root.store.User.name"></Login>
  </div>
</template>

<script>
import Admin from './views/pages/Admin.vue';
import Dashboard from './views/pages/Dashboard.vue';
import Login from './views/components/Login';
import NewMatch from './views/components/NewMatch';
import uuidv4 from 'uuid/v4';
import crud from '@/mixins/crud';

import FAKE_MATCHES from './data/FAKE_matches.js';

export default {
  name: 'App',
  mixins: [crud],
  data: function() {
    return{
      activeModal: ''
    }
  },
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

    this.getData_FAKE(FAKE_MATCHES).then((results)=>{
      console.log(results);
      this.$root.store.active_data.matches = results;
    })

    this.$root.eventHub.$on('activeModal', (modalName)=>{
      console.log('active modal: ', modalName);
      this.$root.store.activeModal = modalName;
    this.activeModal = modalName;
      console.log(this.$root.store);
    })
  },
  methods: {
    // TODO move this to a mixin or something
    resetUser: function() {
      this.$root.store.User.name = null;
      this.$root.store.User.venmo = null;
      this.$root.store.User.id = null;

      // TODO move this
      localStorage.setItem('brosUser', JSON.stringify(this.$root.store.User));
    }
  },
  components: {
    Admin,  
    Dashboard,
    Login,
    NewMatch
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
