<template>
  <div class="register-wrapper">
    <div v-if="oldUserData && oldUserData.name">
      <h1><span class="title">COVID Smash</span></h1>
      <h3 class="b-yellow p-sm">Welcome back, {{ oldUserData.name }}! We're changing how you login to provide more consistent results and future enhancements. Please fill out your details below!</h3>
    </div>
    <div v-else class="register-intro">
      <h1>Welcome to <span class="title">COVID Smash</span></h1>
      <p>
        The COVID-19 quarantine has spawned the future of spectator sports - all CPU controlled Super Smash Bros matches (<a
          href="https://www.twitch.tv/dietwolfcola"
          target="_blank"
          rel="noreferrer"
        >stream found here</a>). To join in on the fun, create a free account below by enter some details below.
      </p>
    </div>
    <form action="#" @submit.prevent="ON_SUBMIT" class="form form-register">
      <div class="input-group">
        <label for="name">*Name</label>
        <input type="name" placeholder="Name" id="name" v-model="form.name" required autofocus />
      </div>
      <div class="input-group">
        <label for="email">*Email</label>
        <input type="email" placeholder="peppy@corneria.com" v-model="form.email" required />
      </div>
      <div class="input-group">
        <label for="email">*Password</label>
        <input type="password" placeholder="password" v-model="form.password" required />
      </div>
      <div class="input-group">
        <label for="referrer">*Referrer</label>
        <input type="text" placeholder="Rusty" id="referrer" v-model="form.referrer" required />
      </div>
      <div class="auth-error-msg" v-if="this.error">
        <p>{{this.error}}</p>
      </div>
      <h5>*Required field</h5>
      <button type="submit" class="blue">Register!</button>
    </form>
  </div>
</template>

<script>
import firebase from "firebase/app";
import { v4 as uuidv4 } from 'uuid';

export default {
  data() {
    return {
      oldUserData: null,
      form: {
        name: (this.oldUserData || {}).name || "",
        email: "",
        password: "",
        referrer: (this.oldUserData || {}).referrer || "",
        id: (this.oldUserData || {}).id || uuidv4()
      },
      error: null
    };
  },
  mounted() {
    this.oldUserData = JSON.parse(localStorage.getItem("brosUser"));

    if (this.oldUserData) {
      this.form.name = this.oldUserData.name;
      this.form.id = this.oldUserData.id;
      this.form.referrer = this.oldUserData.referrer;
    }
  },
  methods: {
    ON_SUBMIT() {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.form.email, this.form.password)
        .then(data => {
          data.user
            .updateProfile({
              displayName: this.form.name,
              referrer: this.form.referrer
            })
            .then(() => {
              localStorage.setItem('hasLoggedFb', true)
              localStorage.removeItem('brosUser');
            });
        })
        .catch(err => {
          this.error = err.message;
        });
    }
  },
  watch: {
    oldUserData(newVal) {
      this.form.name = newVal.name;
      this.form.id = newVal.id;
      this.form.referrer = newVal.referrer;
    }
  }
};
</script>