<template>
  <section class="admin">
    <h1>ADMIN</h1>
    <button @click="toggleBets" :class="[betsOpen ? 'red' : '']">{{ betsOpen ? 'Close': 'Open'}} bets</button>
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

export default {
  data: function() {
    return {
      activeModal: null,
      betsOpen: null
    }
  },
  methods: {
    addMatch: function() {
      this.$root.eventHub.$emit('activeModal', 'newMatch');
    },
    toggleBets: function() {
      this.betsOpen = !this.betsOpen
    }
  },
  components: {
    Matchup
  },
}
</script>