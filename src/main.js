import Vue from 'vue'
import App from './App.vue'
import router from './router'
import firebase from 'firebase/app'
import 'firebase/auth'

import styles from './styles/main.scss'; // eslint-disable-line no-unused-vars

Vue.config.productionTip = false
Vue.config.devtools = true

var eventHub = new Vue();


const firebaseConfig = {
  apiKey: process.env.VUE_APP_API_KEY,
  authDomain: process.env.VUE_APP_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_DATABASE_URL,
  projectId: process.env.VUE_APP_PROJECT_ID,
  storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_APP_ID,
  measurementId: process.env.VUE_APP_MEASUREMENT_ID
};


firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged(user =>  {
  console.log('Auth changed: ', user);
  theApp.store.User.loggedIn = user !== null;
  if (user) {
    // User is signed in.
    theApp.store.User.data = { name: user.displayName, email: user.email, user_id: user.uid };
    theApp.$router.replace({ name: "Home" });

    localStorage.setItem('auth', true);
  } else {
    // No user is signed in.
    theApp.store.User.data = null;
    theApp.$router.replace({ name: "Login" });

    localStorage.setItem('auth', false);
  }
});

var theApp = new Vue({
  data: {
    eventHub: eventHub,
    COLORS: ['#ce1000', '#0b418d', '#ffca00', '#2a844a'],
    COLORS_NAME: ['red', 'blue', 'yellow', 'green'],
    store: {
      activeTab: 'n64',
      activeView: 'home',
      User: {
        id: null,
        name: null,
        referrer: null,
        vnm: null,
        picks: [],
        matchType: null,
        loggedIn: localStorage.getItem('auth') == 'true',
        data: null
      },
      active_data: {
        matches: [],
        matchResults: {}
      },
      archive_data: {
        matches: [],
        matchResults: {}
      }
    },
  },
  router,
  render: h => h(App)
}).$mount('#app')
