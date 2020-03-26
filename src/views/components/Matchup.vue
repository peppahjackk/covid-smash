<template>
  <div class="matchup-wrapper" :class="[admin ? 'admin' : '', status]">
    <div class="table-header">
      <h3>Fight #{{fightNumber}} - {{ content.stage }}</h3>
      <h3 class="status">Status: {{status}}</h3>
      <button v-if="status === 'PENDING'" class="blue">Start Match</button>
      <button v-if="status === 'IN-PROGRESS'" class="red">End Match</button>
    </div>
    <div class="badge horizontal" v-if="status != 'COMPLETE' ">
      <p>Total Pot:</p>
      <h2>${{ totalValue }}</h2>
      <p> @ ${{ content.pick_value }} ea</p>
    </div>
    <table>
      <thead>
        <th v-if="!admin">Pick</th>
        <th>Fighter</th>
        <th>Picks</th>
        <th>To Win</th>
      </thead>
      <tr v-for="(fighter,i) in content.fighters" :key="fighter.name" :class="[checkWinner(fighter.name)]">
        <td v-if="!admin">
          <button @click="addBet();">${{ content.pick_wager }}</button>
        </td>
        <td>
          <h3>{{ fighter.name }}</h3>
        </td>
        <td class="fighter-pool">
          <div class="bar-wrapper">
            <div class="bar-label">
              <p class="pick-num">{{ fighter.picks }}</p>
            </div>
            <div
              class="bar-container"
              :style="{ width: `${fighter.picks / totalPicks * 100}%`, backgroundColor: [fighter.picks ? $root.COLORS[i] : '#666'] }"
            ></div>
              <p class="picker" v-if="admin"><span v-for="(picker) in fighter.pickers" :key="fighter.name + picker">{{ picker }}, </span></p>
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
</template>

<script>
export default {
  props: {
    admin: Boolean,
    content: Object,
    fightNumber: Number
  },
  methods: {
    addBet() {
      console.log("add bet");
    },
    calcPayout: function(picks) {
      if (picks) {
        return (
          ((this.content.pick_value * this.totalPicks - picks * this.content.pick_value) / picks).toFixed(2)
        );
      } else {
        return 0;
      }
    },
    checkWinner: function(name) {
      if (!this.content.winning_fighter) {
        return '';
      }

      if (name === this.content.winning_fighter) {
        return 'winner';
      } else {
        return 'loser';
      }
    }
  },
  computed: {
    status: function() {
      if (this.content.in_progress) {
        return 'IN-PROGRESS'
      } else if (this.content.complete) {
        return 'COMPLETE'
      } else {
        return 'PENDING'
      }
    },
    totalPicks: function() {
      console.log(this.content);
      let total = 0;
      this.content.fighters.forEach(fighter => (total += fighter.picks));
      return total;
    },
    totalValue: function() {
      return this.totalPicks * this.content.pick_value
    }
  },
};
</script>