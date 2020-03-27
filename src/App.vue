<template>
  <div id="app">
    <div v-if="$root.store.User.name" class="banner">
      <p>
        Welcome back {{ $root.store.User.name }}!
        <span class="underline" @click="resetUser">Not you?</span>
      </p>
    </div>
    <Dashboard></Dashboard>
    <Admin v-if="$root.store.User.name === 'rustyM' || $root.store.User.name === 'Theo'"></Admin>
    <NewMatch v-if="activeModal === 'newMatch'"></NewMatch>
    <Login v-if="!$root.store.User.name"></Login>
  </div>
</template>

<script>
import Admin from "./views/pages/Admin.vue";
import Dashboard from "./views/pages/Dashboard.vue";
import Login from "./views/components/Login";
import NewMatch from "./views/components/NewMatch";
import crud from "@/mixins/crud";

// import FAKE_MATCHES from "./data/FAKE_matches.js";

export default {
  name: "App",
  mixins: [crud],
  data: function() {
    return {
      activeModal: ""
    };
  },
  mounted: function() {
    let theUser = JSON.parse(localStorage.getItem("brosUser"));

    if (!theUser) {
      theUser = {
        id: null,
        name: null,
        venmo: null
      };
    }

    this.$root.store.User = theUser;

    this.$root.eventHub.$on("activeModal", modalName => {
      this.$root.store.activeModal = modalName;
      this.activeModal = modalName;
    });

    this.fetchMatches();

    window.setInterval(this.fetchMatches, 5000);

    this.$root.eventHub.$on("fetchMatches", () => {
      this.fetchMatches();
    });
  },
  methods: {
    fetchMatches: function() {
      this.getMatches().then(results => {
        this.fetchPicks(results).then(pickResults => {
          let matchPicks = {};
          let userPicks = [];
          let users = {};

          if (typeof pickResults != "string") {
            for (let i = 0; i < pickResults.length; i++) {
              let pick = pickResults[i];

              let matchName = "match-" + pick.match_id;

              if (!matchPicks[matchName]) {
                matchPicks[matchName] = {};
              }

              if (!matchPicks[matchName][pick.fighter]) {
                matchPicks[matchName][pick.fighter] = [];
              }

              matchPicks[matchName][pick.fighter].push(pick.name);

              if (pick.user_id === this.$root.store.User.id) {
                userPicks.push(pick);
              }

              if (!users['user-'+ pick.user_id]) {
                users['user-'+pick.user_id] = {
                  name: pick.name,
                  venmo: pick.venmo,
                  picks: []
                }
              }

              users['user-'+pick.user_id].picks.push(pick);
            }
          }

          this.$root.store.active_data.picks = matchPicks;
          this.$root.store.User.picks = userPicks;
          this.$root.store.active_data.matches = results;
          this.$root.store.active_data.users = users;
        });
      });

      // this.getData_FAKE(FAKE_MATCHES).then(results => {
      //   console.log(results);
      //   this.$root.store.active_data.matches = results;
      // })
    },
    fetchPicks: function(match_ids) {
      return this.getPicks(match_ids).then(results => {
        return results;
      });
    },
    // TODO move this to a mixin or something
    resetUser: function() {
      this.$root.store.User.name = null;
      this.$root.store.User.venmo = null;
      this.$root.store.User.id = null;
      this.$root.store.User.picks = {};

      // TODO move this
      localStorage.setItem("brosUser", JSON.stringify(this.$root.store.User));
    }
  },
  components: {
    Admin,
    Dashboard,
    Login,
    NewMatch
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
