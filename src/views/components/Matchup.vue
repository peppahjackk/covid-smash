<template>
  <div class="matchup-container" :class="[admin ? 'admin' : '', status]">
    <div class="table-header">
      <h3 class="fight-label">Fight #{{fightNumber}} @ {{ content.stage }}</h3>
      <h3 class="status">Status: {{status}}</h3>
    </div>
    <table>
      <thead>
        <th>Pick</th>
        <th>Fighter</th>
        <th>Picks</th>
        <th>To Win</th>
      </thead>
      <tr
        v-for="(fighter,i) in content.fighters"
        :key="fighter.name"
        :class="[checkWinner(fighter.name)]"
      >
        <td v-if="!admin">
          <button
            @click="addBet(fighter.name);"
            :class="[status === 'INACTIVE' ? '' : 'disabled', currentPick === fighter.name ? 'chosen' : '']"
            :style="{backgroundColor: [fighter.pickers.length ? $root.COLORS[i] : '#666']}"
          >${{ content.pick_value }}</button>
        </td>
        <td v-if="admin">
          <button
            @click="selectWinner();"
            :class="[status === 'COMPLETE' ? 'disabled' : '']"
            >Winner</button>
        </td>
        <td class="fighter">
          <h3>{{ fighter.name }}</h3>
        </td>
        <td class="fighter-pool">
          <div class="bar-wrapper">
            <div class="bar-label">
              <p class="pick-num">{{ fighter.pickers.length }}</p>
            </div>
            <div
              class="bar-container"
              :style="{ width: `${fighter.pickers.length / totalPicks * 100}%`, backgroundColor: [fighter.pickers.length ? $root.COLORS[i] : '#666'] }"
            ></div>
            <p class="picker" v-if="admin">
              <span v-for="(picker) in fighter.pickers" :key="fighter.name + picker">{{ picker }},</span>
            </p>
          </div>
        </td>
        <td class="to-win">
          <div class="wins-container">
            <p>+${{calcPayout(fighter.pickers.length)}} each</p>
          </div>
        </td>
      </tr>
    </table>
    <div class="badge horizontal">
      <p>Total Pot:</p>
      <h2>${{ totalValue }}</h2>
      <p>@ ${{ content.pick_value }} ea ({{totalPicks}} picks)</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    admin: Boolean,
    content: Object,
    fightNumber: Number
  },
  data: function() {
    return {
      currentPick: ''
    }
  },
  methods: {
    addBet(fighterName) {
      this.currentPick = fighterName;

      this.$emit('pickSelected', {
        user_id: this.$root.store.User.id,
        match_id: this.content.match_id,
        name: this.$root.store.User.name,
        pick_value: this.content.pick_value,
        net_value: 0,
        fighter: fighterName
      })
    },
    calcPayout: function(picks) {
      if (picks) {
        return (
          (this.content.pick_value * this.totalPicks -
            picks * this.content.pick_value) /
          picks
        ).toFixed(2);
      } else {
        return 0;
      }
    },
    checkWinner: function(name) {
      if (!this.content.winning_fighter) {
        return "";
      }

      if (name === this.content.winning_fighter) {
        return "winner";
      } else {
        return "loser";
      }
    }
  },
  computed: {
    status: function() {
      if (this.content.in_progress === 1) {
        return "IN_PROGRESS";
      } else if (this.content.complete === 1) {
        return "COMPLETE";
      } else {
        return "INACTIVE";
      }
    },
    totalPicks: function() {
      let total = 0;
      this.content.fighters.forEach(fighter => (total += fighter.pickers.length));
      return total;
    },
    totalValue: function() {
      return this.totalPicks * this.content.pick_value;
    }
  },
};
</script>