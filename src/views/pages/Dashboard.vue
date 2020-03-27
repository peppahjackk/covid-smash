<template>
  <section class="dashboard container">
    <h1>COVID Smash</h1>
    <h2>Our stream <a href="https://www.twitch.tv/dietwolfcola" target="_blank" rel="noreferrer">can be found here.</a></h2>
    <div class="pick-wrapper">
      <div class="pick-header">
        <h2>Bets are open: Choose your character!</h2>
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
      <button @click="submitPicks()">Submit picks!</button>
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
    }
  },
  mixins: [crud],
  methods: {
    selectPicks: function(pick) {
      let matchName = 'match' + pick.match_id;

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
  },
  components: {
    Matchup
  }
};
</script>