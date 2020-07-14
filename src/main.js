import Vue from 'vue'
import App from './App.vue'
import router from './router'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

import styles from './styles/main.scss'; // eslint-disable-line no-unused-vars
import utils from './scripts/utils';

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

firebase.auth().onAuthStateChanged(user => {
  if (theApp.store.newUser) {
    // User details aren't updated until the create function returns in register component
    // setting of the user will happen there
    return;
  }
  
  theApp.store.User.loggedIn = user !== null;
  if (user) {
    // User is signed in.
    theApp.store.User.name = user.displayName;
    theApp.store.User.email = user.email;
    theApp.store.User.id = user.uid;
    theApp.store.User.referrer = user.referrer;
    theApp.store.User.isAdmin = (process.env.VUE_APP_ADMIN.indexOf(user.email) >= 0);
    
    if (theApp.$route.path === '/login') {
      theApp.$router.replace({
        path: "/"
      });
    }
    
    // TODO Abstract this to fire mixins
    if (theApp.store.user_meta.ids && theApp.store.user_meta.ids.indexOf(user.uid) < 0) {
      let userMeta = {
        'id': user.uid,
        'name': user.displayName
      };
      userMeta.referrer = user.referrer || '';
      
      firebase.firestore().collection('user_meta').add(userMeta)
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.error(err);
      })
    }
    
    eventHub.$emit('login_COMPLETE');
    localStorage.setItem('auth', true);
  } else {
    // No user is signed in.
    theApp.store.User = {
      id: null,
      name: null,
      referrer: null,
      vnm: null,
      picks: [],
      matchType: null,
      loggedIn: false,
      isAdmin: false,
    };

    eventHub.$emit('login_COMPLETE');
    localStorage.setItem('auth', false);
  }
});


Vue.directive('resize', {
  inserted: function (el, binding) {
    let f = function (evt) {
      if (binding.value(evt, el)) {
        window.removeEventListener('resize', f);
      }
    };
    window.addEventListener('resize', utils.throttle(f, 16, {
      trailing: false,
      leading: true
    }));
  },
});

var theApp = new Vue({
  data: {
    eventHub: eventHub,
    COLORS: ['#ce1000', '#0b418d', '#ffca00', '#2a844a'],
    COLORS_DK: ['#8a0b00', '#082e65', '#d1a700', '#1d5e34'],
    COLORS_NAME: ['red', 'blue', 'yellow', 'green'],
    store: {
      activeTab: 'n64',
      activeView: 'results',
      activeArchivePage: 0,
      newUser: false,
      User: {
        id: null,
        name: null,
        referrer: null,
        vnm: null,
        picks: [],
        matchType: null,
        loggedIn: localStorage.getItem('auth') == 'true',
        isAdmin: false,
        // data: null
      },
      active_data: {
        matches: [],
        matchResults: {}
      },
      future_data: {
        matches: [],
        picks: [],
        ids: [],
        matchResults: {}
      },
      archive_data: {
        matches: [],
        ids: [],
        matchResults: {}
      },
      pendingPicks: {},
      user_meta: {
        data: null,
        names: []
      },
      clientInfo: {
        isDesktop: null,
        short: null
      }
    },
  },
  router,
  render: h => h(App)
}).$mount('#app')


const getMeta = async () => {
  firebase.firestore().collection('user_meta').get()
    .then(data => {
      theApp.store.user_meta.data = data.docs;

      theApp.store.user_meta.names = data.docs.map(doc => {
        if (doc.exists) {
          return doc.data().name
        }
      })

      theApp.store.user_meta.ids = data.docs.map(doc => {
        if (doc.exists) {
          return doc.data().id
        }
      })
    })
    .catch(err => {
      console.log(err);
    })
}

getMeta();