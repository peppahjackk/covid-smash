<template>
  <section class="admin">
    <h1>ADMIN</h1>
    <button @click="toggleBets" :class="[betsOpen ? '' : 'red']">{{ betsOpen ? 'Open': 'Close'}} bets</button>
    <div class="active-match-wrapper">
      <div class="matchups">
        <div 
        class="matchup-wrapper"
        v-for="(match) in $root.store.active_data.matches"
        :key="match.id">
          <Matchup :content="match" :fightNumber="match.match_id" admin></Matchup>
        </div>
      </div>
      <button class="blue" @click="addMatch()">Add Match</button>
    </div>
  </section>
</template>

<script>
import Matchup from '@/views/components/Matchup';
import crud from '@/mixins/crud.js';

export default {
  data: function() {
    return {
      activeModal: null,
    }
  },
  computed: {
    betsOpen: function() {
      if (this.$root.store.active_data.matches.length > 0) {
        return this.$root.store.active_data.matches[this.$root.store.active_data.matches.length - 1].in_progress;
      } else {
        return 0
      }
    }
  },
  mixins: [crud],
  methods: {
    addMatch: function() {
      this.$root.eventHub.$emit('activeModal', 'newMatch');
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

      this.updateMatches({in_progress: newBetsOpen, filter: 'complete=0'}).then(results => {
        console.log(results);
        
        this.betsOpen = !this.betsOpen;
        this.updating = false;

        this.$root.eventHub.$emit('fetchMatches');
      });
    }
  },
  components: {
    Matchup
  },
}
</script>