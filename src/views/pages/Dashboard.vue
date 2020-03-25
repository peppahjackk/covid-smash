<template>
<div class="dashboard-container container">
  <h1>Smash Bros Picks</h1>
  <div class="pick-wrapper">
    <div class="pick-header">
      <h2>Place picks</h2>
      <div class="badge">
        <p>Total pool:</p>
        <h3>${{ activeData.current_pool }}</h3>
      </div>
    </div>
    <div class="pick-body-container">
      <table>
        <thead>
          <th>Pick</th>
          <th>Fighter</th>
          <th>Pool</th>
          <th>To Win</th>
        </thead>
        <tr v-for="(fighter,i) in activeData.fighters" :key="fighter.name">
          <td>
            <button @click="addBet();">${{ activeData.pick_wager }}</button>
          </td>
          <td>
            <h3>{{ fighter.name }}</h3>
          </td>
          <td class="fighter-pool">
            <div class="bar-wrapper">
              <div class="bar-label">
                <p>{{ fighter.picks }}</p>
              </div>
              <div class="bar-container" :style="{ width: `${fighter.picks / totalPicks * 100}%`, backgroundColor: [fighter.picks ? $root.COLORS[i] : '#666'] }">
              </div>

            </div>
          </td>
          <td>
            <div class="wins-container">
              <p>+${{calcPayout(fighter.picks)}} each</p>
            </div>
          </td>
        </tr>
      </table>
    </div>
  </div>
</div>
</template>

<script>
import crud from '@/mixins/crud';

export default {
  data: function() {
    return {
      activeData: {
        fighters: []
      },
    }
  },
  computed: {
    totalPicks: function() {
      let total = 0;
      this.activeData.fighters.forEach(fighter => total += fighter.picks)
      return total;
    }
  },
  mixins: [crud],
  methods: {
    addBet: function() {
      console.log('add bet');
    },
    calcPayout: function(picks) {
      if (picks) {
        return (this.activeData.current_pool - (picks * this.activeData.pick_wager)) / picks
      } else {
        return 0
      }
    }
  },
  created: function() {
    this.getData_FAKE({data: [{match_id: 1, stage: 'RANDOM', fighters: '[{"name":"mario", "picks": 3},{"name":"link", "picks":1},{"name":"DK", "picks":2},{"name":"peach", "picks":0}]', in_progress: 0, pick_count: [3,2,1,0], pick_wager: 5, winning_figter:null, current_pool:30}]}).then((results)=>{
      this.activeData = results;
    })
    // this.getActive().then((results)=>{
    //   console.log(this.activeData);
    //   this.activeData = results;
    // });
  }
}
</script>