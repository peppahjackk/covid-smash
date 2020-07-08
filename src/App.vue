<template>
  <div id="app" ref="app" v-resize="ON_RESIZE">
    <Navbar v-if="$route.name != 'Login'"></Navbar>
    <router-view></router-view>
    <div
      v-if="activeModal"
      @click="$root.eventHub.$emit('activeModal', null)"
      class="modal-overlay"
    ></div>
  </div>
</template>

<script>
import Navbar from "./views/components/Navbar";
import crud from "@/mixins/crud";

// import FAKE_DATA from "./data/FAKE_data.js";

export default {
  name: "App",
  mixins: [crud],
  components: {
    Navbar
  },
  data: function() {
    return {
      activeModal: "",
      initialLoad: true,
      fetching: false
    };
  },
  mounted: function() {
    this.checkClientInfo();

    this.$root.eventHub.$on("activeModal", modalName => {
      this.$root.store.activeModal = modalName;
      this.activeModal = modalName;
    });

    this.$root.eventHub.$on("login_COMPLETE", () => {
      this.fetchMatches();
      this.fetchArchive();

      if (this.isAdmin) {
        window.setInterval(() => {
          this.fetchMatches();
          this.fetchArchive();
        }, 10000);
      } else {
        window.setInterval(this.fetchMatches, 10000);
      }
    });

    this.$root.eventHub.$on("fetchMatches", () => {
      this.fetchMatches();
    });

    this.$root.eventHub.$on("updateUser", () => {
      this.updateUser();
    });
  },
  methods: {
    fetchMatches: function() {
      if (this.fetching) return;
      this.fetching = true;
      // this.getData_FAKE(FAKE_DATA.matches).then(results => {
        this.getMatches().then(results => {
        // this.getData_FAKE(FAKE_DATA.picks).then(pickResults => {
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

              if (!users["user-" + pick.user_id]) {
                users["user-" + pick.user_id] = {
                  name: pick.name,
                  picks: []
                };
              }

              users["user-" + pick.user_id].picks.push(pick);
            }
          }

          userPicks = userPicks.sort((a, b) => {
            return a.match_id - b.match_id;
          });

          // Numerical values come back as strings from the DB, lets coerce them into numbers
          results = results.map(match => {
            let matchKeys = Object.keys(match);

            for (let key of matchKeys) {
              if (
                !isNaN(+match[key]) &&
                match[key] != null &&
                match[key] != ""
              ) {
                match[key] = +match[key];
              }
            }

            return match;
          });

          let futures = [];
          let futureIds = [];

          results = results.filter(match => {
            if (match.stage.toLowerCase() === "various") {
              futures.push(match);
              futureIds.push(match.match_id);
              return false;
            }
            return true;
          });

          this.$root.store.active_data.pickNames = matchPicks;
          this.$root.store.active_data.matches = results;
          this.$root.store.future_data.matches = futures;
          this.$root.store.future_data.ids = futureIds;
          this.$root.store.active_data.matchResults = this.filterMatchResults(results);
          this.$root.store.active_data.users = users;
          this.$root.store.User.picks = userPicks;

          let filteredPicks = this.filterPicks(pickResults);

          this.$root.store.active_data.picks = filteredPicks.active;
          this.$root.store.future_data.picks = filteredPicks.future;

          this.$root.eventHub.$emit("fetchMatches_COMPLETE");

          if (this.initialLoad) {
            this.initialLoad = false;

            if (!this.isAdmin && this.$root.store.active_data.matches.length > 0) {
              this.$root.store.activeView = 'home';
            }
          }

          this.fetching = false;
        });
      });
    },
    fetchPicks: function(match_ids) {
      return this.getPicks(match_ids).then(results => {
        return results;
      });
    },
    fetchArchive: function() {
      this.getMatches(true).then(results => {
        this.fetchPicks(results).then(pickResults => {
          this.$root.store.archive_data.matches = results;
          // this.$root.store.archive_data.matchResults = this.filterMatchResults(results);
          this.$root.store.archive_data.picks = this.filterPicks(pickResults);
        });
      });
    },
    // TODO move this to a mixin or something
    resetUser: function() {
      this.$root.store.User.name = null;
      this.$root.store.User.character = null;
      this.$root.store.User.referrer = null;
      this.$root.store.User.vnm = null;
      this.$root.store.User.id = null;
      this.$root.store.User.picks = {};
      localStorage.removeItem("brosUserLogged");

      this.$root.eventHub.$emit("updateUser");
    },
    updateUser: function() {
      localStorage.setItem("brosUser", JSON.stringify(this.$root.store.User));

      if (!this.$root.store.User.name) return;

      let userLogged = JSON.parse(localStorage.getItem("brosUserLogged"));

      this.putUser({
        name: this.$root.store.User.name,
        referrer: this.$root.store.User.referrer,
        user_id: this.$root.store.User.id,
        vnm: this.$root.store.User.vnm
      }).then(results => {
        if (!userLogged) {
          localStorage.setItem("brosUserLogged", "true");
        }
        console.log(results);
      });
    },
    filterPicks: function(picks) {
      let pickerList = {
        'active': [],
        'future': []
      };

      for (let pick of picks) {
        let matchList = pickerList.active;

        if (this.$root.store.future_data.ids.indexOf(parseInt(pick.match_id)) >= 0) {
          matchList = pickerList.future;
        }
        
        if (!matchList["picker-" + pick.user_id]) {
          matchList["picker-" + pick.user_id] = [];
        }

        matchList["picker-" + pick.user_id].push(pick);
      }

      return pickerList;
    },
    filterMatchResults: function(matches) {
      let matchResults = {};

      for (let match of matches) {
        if (match.complete == 0) continue;
        if (match.complete) {
          let newResults = {};
          newResults = {
            totalPicks: 0
          };
          for (let fighter of match.fighters) {
            if (
              !this.$root.store.active_data.pickNames["match-" + match.match_id]
            )
              continue;
            if (
              !this.$root.store.active_data.pickNames[
                "match-" + match.match_id
              ][fighter.name]
            )
              this.$root.store.active_data.pickNames["match-" + match.match_id][
                fighter.name
              ] = [];

            let fighterPicks =
              this.$root.store.active_data.pickNames["match-" + match.match_id][
                fighter.name
              ].length || 0;
            newResults[fighter.name] = {
              placement: parseInt(fighter.placement),
              picks: fighterPicks,
              toWin: 0
            };

            if (parseInt(fighter.placement) === 1) {
              newResults.winner = fighter.name;
            }

            newResults.totalPicks += fighterPicks;
          }

          if (!newResults.winner) newResults.winner = false;

          for (let fighter of match.fighters) {
            if (newResults[fighter.name].picks) {
              newResults[fighter.name].toWin =
                (newResults.totalPicks * 5) / newResults[fighter.name].picks;
            } else {
              newResults[fighter.name].toWin = 0;
            }
          }

          matchResults["match-" + match.match_id] = newResults;
        }
      }

      return matchResults;
    },
    ON_RESIZE() {
      console.log("resizing");
      this.checkClientInfo();
    },
    checkClientInfo() {
      let box = this.$refs.app.getBoundingClientRect();

      if (box.width > 992 && this.$root.store.clientInfo.isDesktop != true) {
        this.$root.store.clientInfo.isDesktop = true;
        this.$root.eventHub.$emit("client-change");
      } else if (
        box.width <= 992 &&
        this.$root.store.clientInfo.isDesktop != false
      ) {
        this.$root.store.clientInfo.isDesktop = false;
        this.$root.eventHub.$emit("client-change");
      }

      if (
        window.innerHeight < 799 &&
        this.$root.store.clientInfo.short != true
      ) {
        this.$root.store.clientInfo.short = true;
      } else if (
        window.innerHeight > 799 &&
        this.$root.store.clientInfo.short != false
      ) {
        this.$root.store.clientInfo.short = false;
      }
    }
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
