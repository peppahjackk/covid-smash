<template>
  <div id="app">
    <div v-if="$root.store.User.name" class="banner">
      <p>
        Welcome back {{ $root.store.User.name }}!
        <span class="underline" @click="resetUser">Not you?</span>
      </p>
    </div>
    <Dashboard></Dashboard>
    <Admin></Admin>
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

          for (let i = 0; i < pickResults.length; i++) {
            let pick = pickResults[i];
            
            if (!matchPicks['match-' + pick.match_id]) {
              matchPicks['match-' + pick.match_id] = {};
            }
            
            if (!matchPicks['match-' + pick.match_id][pick.fighter]) {
              matchPicks['match-' + pick.match_id][pick.fighter] = [];
            }

            matchPicks['match-' + pick.match_id][pick.fighter].push(pick.name);
          }

          this.$root.store.active_data.picks = matchPicks;
          this.$root.store.active_data.matches = results;
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
