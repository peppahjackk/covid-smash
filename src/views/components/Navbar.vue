<template>
  <nav>
    <div class="nav-content">
      <p>Welcome back {{ $root.store.User.data.name }}! Not you?
        <a class="underline" @click="signOut">Logout</a></p>
    </div>
  </nav>
</template>

<script>
import firebase from 'firebase/app'

export default {
  methods: {
    signOut() {
      localStorage.removeItem('brosUser');
      firebase
        .auth()
        .signOut()
    }
  }
};
</script>