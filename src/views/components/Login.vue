<template>
<div class="login-wrapper">
  <div class="modal">
    <div class="modal-body">
      <h1>Welcome to COVID Smash</h1>
      <p>Welcome to CPU Smash Brothers!  The COVID-19 quarantine has spawned the future of sports and sports betting - <a href="https://www.twitch.tv/dietwolfcola" target="_blank" rel="noreferrer">all CPU Super Smash Bros matches (stream found here</a>).  Join us, bet on your favorite characters, and stay healthy!  All bets are final once placed.</p>
      <h3>Please enter your name and venmo username</h3>
      <div class="form">
        <input type="text" placeholder="name" v-model="name">
        <input type="text" placeholder="@venmo-name" v-model="venmo">
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
      venmo: ''
    }
  },
  methods: {
    submitUser: function() {
      if (!this.name || !this.venmo) return;

      this.$root.store.User.name = this.name;
      this.$root.store.User.venmo = this.venmo;
      this.$root.store.User.id = uuidv4(), // unique id given to the user for db identification

      // TODO move this to a watcher or at least a mixin
      localStorage.setItem('brosUser', JSON.stringify(this.$root.store.User));
    },
  }
}
</script>