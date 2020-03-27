<template>
  <section class="dashboard container">
    <div class="dashboard-body-container">
      <div class="pick-wrapper">
          <h1>COVID Smash</h1>
          <h2>Our stream <a href="https://www.twitch.tv/dietwolfcola" target="_blank" rel="noreferrer" >can be found here.</a></h2>
        <div class="pick-header">
          <h2 class="bg-red">Choose your character!</h2>
        </div>
        <div class="matchups">
          <div
            class="matchup-wrapper"
            v-for="(match) in $root.store.active_data.matches"
            :key="match.match_id"
          >
            <Matchup :content="match" :fightNumber="match.match_id" @pickSelected="selectPicks"></Matchup>
          </div>
        </div>
      </div>
      <div class="sidebar">
        <h3>Your bets:</h3>
        <div class="sidebar-picks-container">
          <table v-for="(pick) in pendingPicks" :key="pick.match_id" class="sidebar-pick-wrapper">
            <tr>
              <td>Match</td>
              <td>{{pick.match_id}}</td>
            </tr>
            <tr>
              <td>Fighter</td>
              <td>{{pick.fighter}}</td>
            </tr>
            <tr>
              <td>Amount</td>
              <td>${{pick.pick_value}}</td>
            </tr>
          </table>
          <p>Total bet amount: ${{ getTotalBet(pendingPicks) }}</p>
          <button @click="submitPicks()" :class="[betsClosed ? 'disabled' : '']">Submit picks!</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Matchup from "@/views/components/Matchup";
import crud from "@/mixins/crud";

export default {
  data: function() {
    return {
      submittedPicks: null,
      pendingPicks: {}
    };
  },
  computed: {
    betsClosed: function() {
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
    selectPicks: function(pick) {
      let matchName = "match" + pick.match_id;

      if (pick.delete) {
        delete this.pendingPicks[matchName];
        return;
      }

      let venmoName = this.$root.store.User.venmo;

      this.pendingPicks[matchName] = pick;
      this.pendingPicks[matchName].venmo = venmoName;
    },
    submitPicks: function() {
      for (let key of Object.keys(this.pendingPicks)) {
        this.postPick(this.pendingPicks[key]);
      }
    },
    getTotalBet: function(picks) {
      let total = 0;
      for (let i in picks) {
        total += picks[i].pick_value;
      }
      return total;
    }
  },
  components: {
    Matchup
  }
};
</script>