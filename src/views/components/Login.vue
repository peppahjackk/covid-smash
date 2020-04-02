<template>
<div class="login-wrapper">
  <div class="modal">
    <div class="modal-body">
      <h1>Welcome to COVID Smash</h1>
      <p>The COVID-19 quarantine has spawned the future of spectator sports - <a href="https://www.twitch.tv/dietwolfcola" target="_blank" rel="noreferrer">all CPU controlled Super Smash Bros matches (stream found here)</a>.  Join us, root for your favorite characters, and stay healthy!</p>
      <h3>Please enter your name and favorite character (if you'd like)</h3>
      <div class="form">
        <input type="text" placeholder="Name" v-model="name">
        <input type="text" placeholder="Waluigi" v-model="character">
        <button @click="submitUser" class="red">Fight!</button>
      </div>
    </div>
  </div>
  <div class="modal-overlay"></div>
</div>
</template>

<script>
import uuidv4 from "uuid/v4";

export default {
  data: function() {
    return {
      name: '',
      character: ''
    }
  },
  methods: {
    submitUser: function() {
      if (!this.name) return;

      this.$root.store.User.name = this.name;
      this.$root.store.User.character = this.character;
      this.$root.store.User.id = uuidv4(), // unique id given to the user for db identification

      // TODO move this to a watcher or at least a mixin
      localStorage.setItem('brosUser', JSON.stringify(this.$root.store.User));
    },
    anonymousUser: function() {
      this.$root.store.User.name = 'anonymous';
      this.$root.store.User.id = uuidv4(), // unique id given to the user for db identification

      // TODO move this to a watcher or at least a mixin
      localStorage.setItem('brosUser', JSON.stringify(this.$root.store.User));
    }
  }
}
</script>