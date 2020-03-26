import Vue from 'vue'
import App from './App.vue'

import styles from './styles/main.scss'; // eslint-disable-line no-unused-vars

Vue.config.productionTip = false

new Vue({
  data: {
    COLORS: ['#ce1000', '#0b418d', '#ffca00', '#2a844a'],
    store: {
      User: {
        id: null,
        name: null,
        venmo: null,
      },
      active_data: {
        matches: [],
      }
    },
  },
  render: h => h(App),
}).$mount('#app')