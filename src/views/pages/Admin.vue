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
            <th class="short">Id</th>
            <th class="digit">#</th>
            <th class="medium">System</th>
            <th>Game</th>
            <th>Stage</th>
            <th>Rules</th>
            <th>Fighters</th>
            <th class="short">Bets</th>
            <th class="short">Complete</th>
            <th class="short">Standings</th>
            <th class="short">Archive</th> 
            <th>Actions</th>
          </thead>
          <MatchAdmin
            class="matchup-wrapper"
            v-for="(match, i) in $root.store.active_data.matches"
            :content="match"
            :fightNumber="i + 1"
            :key="match.id"
          ></MatchAdmin>
          <tr>
            <td colspan="11">
              <button @click="addMatch">+Add Match</button></td>
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
        </thead>
        <tr v-for="(pick) in $root.store.active_data.picks" :key="pick.pick_id">
          <td>{{pick.match_id}}</td>
          <td>{{pick.name}}</td>
          <td>{{pick.fighter}}</td>
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
        this.$root.eventHub.$on('fetchMatches_COMPLETE', () => {
          this.$forceUpdate();
        })
      });
    }
  },
  components: {
    MatchAdmin
  }
};
</script>