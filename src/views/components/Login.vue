<template>
<div class="login-wrapper">
  <h1><span class="title">COVID Smash</span></h1>
  <h3>Login below to make your picks.</h3>
  <form action="#" @submit.prevent="ON_SUBMIT" class="form">
    <div class="input-group">
      <label for="email">*Email</label>
      <input type="email" placeholder="peppy@corneria.com" v-model="form.email" required />
    </div>
    <div class="input-group">
      <label for="email">*Password</label>
      <input type="password" placeholder="password" v-model="form.password" required />
    </div>
    <div class="auth-error-msg" v-if="this.error">
      <p>{{this.error}}</p>
    </div>
    <button type="submit" class="blue">Fight!</button>
    <h5>*Required field</h5>
  </form>
</div>
</template>

<script>
import firebase from 'firebase/app'

export default {
  data: function() {
    return {
      form: {
        email: '',
        password: ''
      },
      error: null
    }
  },
  methods: {
    ON_SUBMIT() {
      firebase
      .auth()
      .signInWithEmailAndPassword(this.form.email, this.form.password)
      .then(() => {
        console.log('Logged in!');
        localStorage.setItem('hasLoggedFb', true)
      })
      .catch(err => {
        this.error = err.message;
        console.log(err.message);
      })
    }
  }
}
</script>