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
          :key="match.id"
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
  data: function() {
    return {
      activeData: {
        fighters: []
      }
    };
  },
  computed: {
    totalPicks: function() {
      let total = 0;
      this.activeData.fighters.forEach(fighter => (total += fighter.picks));
      return total;
    }
  },
  methods: {
    addBet: function() {
      console.log("add bet");
    },
    submitPicks: function() {
      console.log('submit all');
    },
    calcPayout: function(picks) {
      if (picks) {
        return (
          (this.activeData.current_pool - picks * this.activeData.pick_wager) /
          picks
        );
      } else {
        return 0;
      }
    }
  },
  created: function() {
    // this.getActive().then((results)=>{
    //   console.log(this.activeData);
    //   this.activeData = results;
    // });
  },
  components: {
    Matchup
  }
};
</script>