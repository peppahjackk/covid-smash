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
    <h5>*Required field</h5>
    <div class="auth-error-msg" v-if="this.error">
      <p>{{this.error}}</p>
    </div>
    <button type="submit" class="blue">Fight!</button>
  </form>
  <a class="underline m-t-md" @click="ON_FORGOT_PASSWORD">I forgot my password.</a>
  <div class="auth-success-msg bg-green p-sm m-t-md" v-if="this.success">
    <p>{{this.success}}</p>
  </div>
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
      error: null,
      success: null
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
    },
    ON_FORGOT_PASSWORD() {
      firebase
      .auth()
      .sendPasswordResetEmail(this.form.email)
      .then(() => {
        this.success = 'Email sent!'
      })
      .catch((err) => {
        this.error = err;
      })
    }
  }
}
</script>