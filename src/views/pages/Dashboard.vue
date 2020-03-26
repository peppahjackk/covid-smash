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
          <Matchup :content="match" :fightNumber="match.match_id"></Matchup>
        </div>
      </div>
      <button @click="submitPicks()">Submit picks!</button>
    </div>
  </section>
</template>

<script>
import Matchup from "@/views/components/Matchup";

export default {
  methods: {
    submitPicks: function() {
      console.log('submit all');
      // this.setP
    },
  },
  components: {
    Matchup
  }
};
</script>