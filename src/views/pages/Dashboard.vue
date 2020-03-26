<template>
  <section class="dashboard container">
    <h1>COVID Smash</h1>
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
      console.log(pick);
      let matchName = 'match' + pick.match_id;

      this.pendingPicks[matchName] = pick;
    },
    submitPicks: function() {
      console.log('submit all', this.pendingPicks);
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