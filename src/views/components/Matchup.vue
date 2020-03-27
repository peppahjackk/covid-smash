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
        <td v-if="!admin" class="pick">
          <button
            @click="addBet(fighter.name);"
            :class="[status === 'INACTIVE' ? '' : 'disabled', currentPick === fighter.name ? 'chosen' : '', !matchPicks[fighter.name] ? 'unpicked' : '']"
          >${{ content.pick_value }}</button>
        </td>
        <td v-if="admin">
          <button
            @click="selectWinner(fighter.name);"
            :class="[status === 'COMPLETE' || betsOpen === 0 ? 'disabled' : '']"
          >Winner</button>
        </td>
        <td class="fighter">
          <h3>{{ fighter.name }}</h3>
        </td>
        <td class="fighter-pool">
          <div class="bar-wrapper">
            <div class="bar-label">
              <p
                class="pick-num"
              >{{ matchPicks[fighter.name] ? matchPicks[fighter.name].length : 0 }}</p>
            </div>
            <div
              class="bar-container"
              :style="{ width: [matchPicks[fighter.name] ? `${matchPicks[fighter.name].length / totalPicks * 100}%` : 0], backgroundColor: [matchPicks[fighter.name] ? $root.COLORS[i] : '#666'] }"
            ></div>
            <p class="picker" v-if="admin">
              <span
                v-for="(picker) in matchPicks[fighter.name]"
                :key="fighter.name + picker"
              >{{ picker }},</span>
            </p>
          </div>
        </td>
        <td class="to-win">
          <div class="wins-container">
            <p>+${{calcPayout(matchPicks[fighter.name])}} each</p>
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
import crud from "@/mixins/crud.js";

export default {
  props: {
    admin: Boolean,
    betsOpen: Number,
    content: Object,
    fightNumber: Number
  },
  data: function() {
    return {
      currentPick: ""
    };
  },
  mixins: [crud],
  methods: {
    addBet(fighterName) {
      if (this.currentPick === fighterName) {
        this.currentPick = "";
        this.$emit("pickSelected", {
          match_id: this.content.match_id,
          delete: true
        });

        return;
      }

      this.currentPick = fighterName;

      this.$emit("pickSelected", {
        user_id: this.$root.store.User.id,
        match_id: this.content.match_id,
        name: this.$root.store.User.name,
        pick_value: this.content.pick_value,
        net_value: 0,
        fighter: fighterName
      });
    },
    calcPayout: function(picks) {
      if (picks) {
        return (
          (this.content.pick_value * this.totalPicks -
            picks.length * this.content.pick_value) /
          picks.length
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
    },
    selectWinner: function(name) {
      this.updateMatches({
        winning_fighter: name,
        filter: `match_id=${this.content.match_id}`
      }).then(() => {
        this.$root.eventHub.$emit("fetchMatches");
      });
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
    matchPicks: function() {
      if (this.$root.store.active_data.picks) {
        return this.$root.store.active_data.picks[
          "match-" + this.content.match_id
        ];
      } else {
        return [];
      }
    },
    totalPicks: function() {
      let total = 0;

      for (let pickI in this.matchPicks) {
        total += this.matchPicks[pickI].length;
      }

      return total;
    },
    totalValue: function() {
      return this.totalPicks * this.content.pick_value;
    }
  }
};
</script>