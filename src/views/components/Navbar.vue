<template>
  <nav>
    <div class="nav-wrapper">
      <a @click="$router.push('/')" class="title nav-title"><p>COVID Smash</p></a>
      <div class="nav-left nav-container">
        <a @click="$router.push('/')" :class="[$route.name === 'Home' ? 'active' : '']"><p>Home</p></a>
        <a @click="$router.push('/rules')" :class="[$route.name === 'Rules' ? 'active' : '']"><p>Rules</p></a>
        <a @click="$router.push('/admin')" :class="[$route.name === 'Admin' ? 'active' : '']" v-if="$root.store.User.isAdmin"><p>Admin</p></a>
      </div>
      <div class="nav-right nav-container">
        <a v-if="$root.store.clientInfo.isDesktop" @click="$router.push('/profile')" :class="[$route.name === 'Profile' ? 'active' : '']"><p>Profile</p></a>
        <a class="underline" @click="signOut"><p>Logout</p></a>
      </div>
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