import Vue from 'vue'
import App from './App.vue'

import styles from './styles/main.scss'; // eslint-disable-line no-unused-vars

Vue.config.productionTip = false
Vue.config.devtools = true

var eventHub = new Vue();

new Vue({
  data: {
    eventHub: eventHub,
    COLORS: ['#ce1000', '#0b418d', '#ffca00', '#2a844a'],
    COLORS_NAME: ['red', 'blue', 'yellow', 'green'],
    store: {
      activeView: 'pick',
      User: {
        id: null,
        name: null,
        referrer: null,
        vnm: null,
        picks: [],
        matchType: null,
      },
      active_data: {
        matches: [],
      },
      archive_data: {
        matches: []
      }
    },
  },
  render: h => h(App),
}).$mount('#app')