<template>
  <section class="admin">
    <div class="active-match-wrapper">
      <table class="matchups">
        <tr 
        v-for="(match) in $root.store.active_data.matches"
        :key="match.id">
          <Matchup :content="match" :fightNumber="match.match_id" admin></Matchup>
        </tr>
      </table>
    </div>
  </section>
</template>

<script>
import Matchup from '@/views/components/Matchup';

export default {
  components: {
    Matchup
  }
}
</script>