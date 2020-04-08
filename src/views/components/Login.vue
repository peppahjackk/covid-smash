<template>
<div class="login-wrapper">
  <div class="modal">
    <div class="modal-body">
      <h1>Welcome to COVID Smash</h1>
      <p>The COVID-19 quarantine has spawned the future of spectator sports - <a href="https://www.twitch.tv/dietwolfcola" target="_blank" rel="noreferrer">all CPU controlled Super Smash Bros matches (stream found here)</a>.  Join us, root for your favorite characters, and stay healthy!</p>
      <h3>Please enter your name, who referred you, and favorite character (if you'd like)</h3>
      <div class="form">
        <div class="input-group">
          <label for="name">*Name</label>
          <input type="text" placeholder="Name" id="name" v-model="name">
        </div>
        <div class="input-group">
          <label for="referrer">*Referrer</label>
          <input type="text" placeholder="Rusty" id="referrer" v-model="referrer">
        </div>
        <div class="input-group">
          <label for="referrer">Favorite Character</label>
          <input type="text" placeholder="Waluigi" v-model="character">
        </div>
        <button @click="submitUser" class="red">Fight!</button>
        <h5>*Required field</h5>
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
      character: '',
      referrer: ''
    }
  },
  methods: {
    submitUser: function() {
      if (!this.name || !this.referrer) return;

      this.$root.store.User.name = this.name;
      this.$root.store.User.character = this.character;
      this.$root.store.User.referrer = this.referrer;
      this.$root.store.User.id = uuidv4(), // unique id given to the user for db identification

      this.$root.eventHub.$emit("updateUser");
    },
    anonymousUser: function() {
      this.$root.store.User.name = 'anonymous';
      this.$root.store.User.id = uuidv4(), // unique id given to the user for db identification

      this.$root.eventHub.$emit("updateUser");
    }
  }
}
</script>