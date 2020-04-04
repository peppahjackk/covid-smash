<template>
  <div class="matchup-container" :class="[admin ? 'admin' : '', status]">
    <div class="table-header">
      <h3 class="fight-label">Fight #{{fightNumber}} @ {{ content.stage }}</h3>
      <h3 class="status">Match type: {{ content.match_type }}</h3>
    </div>
    <table>
      <thead>
        <th>Action</th>
        <th>Fighter</th>
        <th>Picks</th>
        <th>Public %</th>
      </thead>
      <tr
        v-for="(fighter,i) in content.fighters"
        :key="fighter.name"
        :class="[checkWinner(fighter.name)]"
      >
        <td v-if="!admin" class="pick">
          <button
            @click="addBet(fighter.name);"
            :class="[status === 'Open for picks' ? '' : 'disabled', currentPick === fighter.name ? 'chosen' : '', matchPicks != null && !matchPicks[fighter.name] ? 'unpicked' : '']"
          >Pick</button>
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
              >{{ matchPicks && matchPicks[fighter.name] ? matchPicks[fighter.name].length : 0 }}</p>
            </div>
            <div
              class="bar-container"
              :style="{ width: [matchPicks && matchPicks[fighter.name] ? `${matchPicks[fighter.name].length / totalPicks * 100}%` : 0], backgroundColor: [matchPicks != null && matchPicks[fighter.name] ? $root.COLORS[i] : '#666'] }"
            ></div>
            <p class="picker" v-if="matchPicks && matchPicks[fighter.name] && matchPicks[fighter.name].length < 10">
              <span
                v-for="(picker) in matchPicks[fighter.name]"
                :key="fighter.name + picker"
              >{{ printFirstName(picker) }}, </span>
            </p>
          </div>
        </td>
        <td class="to-win">
          <div class="wins-container">
            <p v-if="matchPicks">{{calcPercent(matchPicks[fighter.name])}}%</p>
            <p v-if="!matchPicks">-</p>
          </div>
        </td>
      </tr>
    </table>
    <h3 class="status">Match status: {{status}}</h3>
    <div class="badge horizontal">
      <p>Total Picks:</p>
      <h2>{{ totalPicks }}</h2>
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
      console.log(this.content);
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
    calcPercent: function(picks) {
      if (picks) {
        return (picks.length / this.totalPicks * 100).toFixed(2)
      }
    },
    printFirstName: function(name) {
      var spaceIdx = name.indexOf(' ');
      return name.substring(0, spaceIdx != -1 ? spaceIdx : name.length);
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
        return "Open for picks";
      }
    },
    matchPicks: function() {
      if (this.$root.store.active_data.picks) {
        return this.$root.store.active_data.picks[
          "match-" + this.content.match_id
        ];
      } else {
        console.log('picks null');
        return null;
      }
    },
    totalPicks: function() {
      let total = 0;

      for (let pickI in this.matchPicks) {
        if (this.matchPicks[pickI]) {
          total += this.matchPicks[pickI].length;
        }
      }

      return total;
    },
    totalValue: function() {
      return this.totalPicks * this.content.pick_value;
    }
  }
};
</script>