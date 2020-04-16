<template>
  <section class="admin">
    <h1>ADMIN</h1>
    <button
      @click="toggleBets"
      :class="[betsOpen ? '' : 'red']"
    >{{ betsOpen ? 'Open': 'Close'}} bets</button>
    <div class="active-match-wrapper">
      <div class="matchups">
        <table>
          <thead>
            <th>Fight #</th>
            <th>System</th>
            <th>Game</th>
            <th>Stage</th>
            <th>Rules</th>
            <th>Fighters</th>
            <th>In Progress</th>
            <th>Complete</th>
            <th>Hidden</th>
            <th>Hide from Standings</th>
            <th>Actions</th>
          </thead>
          <MatchAdmin
            class="matchup-wrapper"
            v-for="(match, i) in $root.store.active_data.matches"
            :content="match"
            :fightNumber="i + 1"
            :key="match.id"
          ></MatchAdmin>
        </table>
      </div>
      <button class="blue" @click="addMatch()">Add Match</button>
    </div>
    <div class="user-list">
      <table>
        <thead>
          <th>Name</th>
          <th>vnm</th>
        </thead>
        <tr v-for="(user) in $root.store.active_data.users" :key="user.user_id">
          <td>{{user.name}}</td>
          <td>{{user.vnm}}</td>
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
      });
    }
  },
  components: {
    MatchAdmin
  }
};
</script>