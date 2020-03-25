<template>
<div class="login-wrapper">
  <div class="modal">
    <div class="modal-body">
      <h1>Welcome to COVID Smash</h1>
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

      // TODO move this to a watcher or at least a mixin
      localStorage.setItem('brosUser', JSON.stringify(this.$root.store.User));
    },
  }
}
</script>