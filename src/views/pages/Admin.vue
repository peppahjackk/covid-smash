<template>
  <section class="admin">
    <h1>ADMIN</h1>
    <button
      @click="toggleBets"
      :class="[betsOpen ? '' : 'red']"
    >{{ betsOpen ? 'Open': 'Close'}} bets</button>
    <div class="pick-header">
      <h2
        @click="$root.store.activeView = 'home'"
        :class="[$root.store.activeView === 'home' ? 'bg-baseAccent' : '']"
      >Active Matches</h2>
      <h2
        @click="$root.store.activeView = 'archive'"
        :class="[$root.store.activeView === 'archive' ? 'bg-baseAccent' : '']"
      >Archive</h2>
    </div>
    <div class="active-match-wrapper">
      <div class="matchups">
        <table>
          <thead>
            <th class="short">Id</th>
            <th class="digit">#</th>
            <th class="medium">System</th>
            <th>Game</th>
            <th>Stage</th>
            <th>Fighters</th>
            <th>Rules</th>
            <th class="short">Bets</th>
            <th class="short">Complete</th>
            <th class="short">Standings</th>
            <th class="short">Archive</th>
            <th>Actions</th>
          </thead>
          <MatchAdmin
            v-show="$root.store.activeView === 'home'"
            class="matchup-wrapper"
            v-for="(match, i) in $root.store.active_data.matches"
            :content="match"
            :fightNumber="i + 1"
            :key="match.id"
          ></MatchAdmin>
          <MatchAdmin
            v-show="$root.store.activeView === 'archive'"
            class="matchup-wrapper"
            v-for="(match, i) in $root.store.archive_data.matches"
            :content="match"
            :fightNumber="i + 1"
            :key="match.id"
          ></MatchAdmin>
          <tr v-show="$root.store.activeView === 'home'">
            <td colspan="11">
              <button @click="addMatch">+Add Match</button>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <div class="user-list">
      <table>
        <thead>
          <th>Match Id</th>
          <th>Name</th>
          <th>Fighter</th>
          <th>Actions</th>
        </thead>
        <tr v-for="(pick) in $root.store.active_data.picks" :key="pick.pick_id">
          <td>{{pick.match_id}}</td>
          <td>{{pick.name}}</td>
          <td>{{pick.fighter}}</td>
          <td>
            <div class="action-container">
              <div @click="ON_PICK_DELETE(pick)">
                <svg
                  class="icon icon-default icon-trash"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 418.17 512"
                >
                  <title>icon-trash</title>
                  <path
                    d="M416.88,114.44,405.57,80.55A31.52,31.52,0,0,0,375.63,59h-95V28a28.06,28.06,0,0,0-28-28h-87a28.06,28.06,0,0,0-28,28V59h-95A31.54,31.54,0,0,0,12.6,80.55L1.3,114.44a25.37,25.37,0,0,0,24.06,33.4H37.18l26,321.6A46.54,46.54,0,0,0,109.29,512H314.16a46.52,46.52,0,0,0,46.1-42.56l26-321.6h6.54a25.38,25.38,0,0,0,24.07-33.4ZM167.56,30h83.06V59H167.56Zm162.8,437a16.36,16.36,0,0,1-16.2,15H109.29a16.36,16.36,0,0,1-16.2-15L67.27,147.84h288.9ZM31.79,117.84l9.27-27.79A1.56,1.56,0,0,1,42.55,89H375.63a1.55,1.55,0,0,1,1.48,1.07l9.27,27.79Z"
                  />
                  <path
                    d="M282.52,466l.79,0a15,15,0,0,0,15-14.22l14.09-270.4a15,15,0,0,0-30-1.56L268.32,450.2A15,15,0,0,0,282.52,466Z"
                  />
                  <path
                    d="M120.57,451.79a15,15,0,0,0,15,14.19c.28,0,.56,0,.83,0a15,15,0,0,0,14.16-15.79l-14.75-270.4a15,15,0,1,0-30,1.63Z"
                  />
                  <path
                    d="M209.25,466a15,15,0,0,0,15-15V180.58a15,15,0,0,0-30,0V451A15,15,0,0,0,209.25,466Z"
                  />
                </svg>
              </div>
            </div>
          </td>
        </tr>
      </table>
    </div>
  </section>
</template>

<script>
import MatchAdmin from "@/views/components/MatchAdmin";
import crud from "@/mixins/crud.js";

export default {
  data: function() {
    return {
      activeModal: null
    };
  },
  computed: {
    betsOpen: function() {
      if (this.$root.store.active_data.matches.length > 0) {
        return this.$root.store.active_data.matches[
          this.$root.store.active_data.matches.length - 1
        ].in_progress;
      } else {
        return 0;
      }
    }
  },
  mixins: [crud],
  methods: {
    addMatch: function() {
      this.$root.eventHub.$emit("activeModal", "newMatch");
    },
    toggleBets: function() {
      if (this.updating) return;
      this.updated = true;

      let newBetsOpen;

      if (this.betsOpen === 0) {
        newBetsOpen = 1;
      } else {
        newBetsOpen = 0;
      }

      this.updateMatches({
        in_progress: newBetsOpen,
        filter: "complete=0"
      }).then(results => {
        console.log(results);

        this.betsOpen = !this.betsOpen;
        this.updating = false;

        this.$root.eventHub.$emit("fetchMatches");
        this.$root.eventHub.$on("fetchMatches_COMPLETE", () => {
          this.$forceUpdate();
        });
      });
    },
    ON_PICK_DELETE: function(pick) {
      let confirmed = confirm(
        `Are you sure you'd like to delete ${pick.name}'s pick of ${pick.fighter} in match ${pick.match_id}?`
      );
      if (!confirmed) return;

      console.log("PICK DELETE");
      this.deleteRow({
        req: "delete",
        table: "picks",
        filter: `pick_id='${pick.pick_id}'`
      }).then(results => {
        console.log(results);
        this.$root.eventHub.$emit("fetchMatches");
      });
    }
  },
  components: {
    MatchAdmin
  }
};
</script>