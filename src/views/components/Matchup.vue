<template>
  <div class="matchup-container" :class="[status]">
    <div class="table-header">
      <h3 v-if="fightNumber" class="fight-label">Fight #{{fightNumber}}</h3>
      <h3 v-if="content.system" class="bg-baseAccent">{{ content.system }}: {{ content.game }}</h3>
      <h3 v-if="content.match_type" class="bg-yellow c-base">{{ content.match_type }}</h3>
      <h3 v-if="content.stage" class="bg-baseAccent2">@ {{ content.stage }}</h3>
      <h3 class="status">{{status}}</h3>
    </div>
    <div class="matchup-grid">
      <div class="matchup-head fighter-header">
        <h4 v-if="$root.store.clientInfo.isDesktop">{{ content.complete ? 'Placement' : 'Action' }}</h4>
        <h4>Fighter</h4>
        <h4>Picks</h4>
        <h4>Public %</h4>
      </div>
      <div
        v-for="(fighter,i) in content.fighters"
        :key="fighter.name"
        class="fighter-row"
        :class="[checkWinner(fighter.name), pendingPick === fighter.name ? 'pending' : '', currentPick === fighter.name ? 'current' : '']"
      >
        <div class="pick" v-if="!content.complete">
          <button
            @click="addBet(fighter.name);"
            :class="[status === 'Open for picks' ? '' : 'disabled',
            pendingPick === fighter.name ? 'chosen' : '',
            currentPick === fighter.name ? 'chosen' : '',
            matchPicks != null && !matchPicks[fighter.name] ? 'unpicked' : '',
            $root.COLORS_NAME[i % $root.COLORS_NAME.length]]"
          >{{ $root.store.clientInfo.isDesktop ? 'Pick' : fighter.name }}</button>
        </div>
        <div class="result" :style="{ backgroundColor: [parseInt(fighter.placement) === 1 ? $root.COLORS[i % $root.COLORS.length]: '']}" v-else>
          <h2 :class="[i === 2 && parseInt(fighter.placement) === 1 ? 'c-baseAccent' : '']">{{ fighter.placement + getPlacementString(fighter.placement) }}<span v-if="!$root.store.clientInfo.isDesktop">: {{ fighter.name }}</span></h2>
        </div>
        <div v-if="$root.store.clientInfo.isDesktop" class="fighter">
          <h3>{{ fighter.name }}</h3>
        </div>
        <div class="fighter-pool">
          <div class="bar-wrapper">
            <div class="bar-label">
              <p
                class="pick-num"
              >{{ matchPicks && matchPicks[fighter.name] ? matchPicks[fighter.name].length : 0 }}</p>
            </div>
            <div
              class="bar-container"
              :style="{ width: [matchPicks && matchPicks[fighter.name] ? `${matchPicks[fighter.name].length / totalPicks * 100}%` : 0], backgroundColor: [matchPicks != null && matchPicks[fighter.name] ? $root.COLORS[i % $root.COLORS.length] : '#666'] }"
            ></div>
            <p
              class="picker"
              v-if="matchPicks && matchPicks[fighter.name]"
            >
              <span
                v-for="(picker) in matchPicks[fighter.name]"
                :key="fighter.name + picker"
              >{{ printFirstName(picker) }},</span>
            </p>
          </div>
        </div>
        <div class="to-win">
          <div class="wins-container">
            <p v-if="matchPicks">{{calcPercent(matchPicks[fighter.name])}}%</p>
            <p v-if="!matchPicks">-</p>
          </div>
        </div>
      </div>
    </div>
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
    betsOpen: Number,
    content: Object,
    fightNumber: Number,
    archive: Boolean
  },
  mixins: [crud],
  data() {
    return {
      pendingPick: "",
      currentPick: ""
    };
  },
  computed: {
    status() {
      if (this.content.in_progress === 1) {
        return "IN_PROGRESS";
      } else if (this.content.complete === 1) {
        return "COMPLETE";
      } else {
        return "Open for picks";
      }
    },
    matchPicks() {
      if (this.archive) {
        if (this.$root.store.archive_data.pickNames) {
          return this.$root.store.archive_data.pickNames[
            "match-" + this.content.match_id
          ];
        } else {
          return null;
        }
      } else {
        if (this.$root.store.active_data.pickNames) {
          return this.$root.store.active_data.pickNames[
            "match-" + this.content.match_id
          ];
        } else {
          return null;
        }
      }
    },
    totalPicks() {
      let total = 0;

      for (let pickI in this.matchPicks) {
        if (this.matchPicks[pickI]) {
          total += this.matchPicks[pickI].length;
        }
      }

      return total;
    },
    totalValue() {
      return this.totalPicks * this.content.pick_value;
    }
  },
  mounted() {
    this.checkCurrentPick();

    this.$root.eventHub.$on("fetchMatches_COMPLETE", () => {
      this.checkCurrentPick();
    });

    this.$root.eventHub.$on("picksSubmitted_COMPLETE", ()=> {
      this.pendingPick = "";
    })
  },
  methods: {
    addBet(fighterName) {
      console.log(this.content);
      if (this.pendingPick === fighterName) {
        this.pendingPick = "";
        this.$emit("pickSelected", {
          match_id: this.content.match_id,
          delete: true
        });
        return;
      }

      this.pendingPick = fighterName;

      this.$emit("pickSelected", {
        user_id: this.$root.store.User.id,
        match_id: this.content.match_id,
        match_idx: this.fightNumber,
        name: this.$root.store.User.name,
        referrer: this.$root.store.User.referrer,
        net_value: 0,
        fighter: fighterName
      });
    },
    calcPercent(picks) {
      if (picks) {
        return ((picks.length / this.totalPicks) * 100).toFixed(0);
      }
    },
    getPlacementString(placement) {
      switch (placement % 10) {
        case 1:
          return 'st'
        case 2:
          return 'nd'
        case 3:
          return 'rd'
        default:
          return 'th'
      }
    },
    printFirstName(name) {
      var spaceIdx = name.indexOf(" ");
      return name.substring(0, spaceIdx != -1 ? spaceIdx : name.length);
    },
    checkCurrentPick() {
      for (let pick of this.$root.store.User.picks) {
        if (parseInt(pick.match_id) === this.content.match_id) {
          this.currentPick = pick.fighter;
        }
      }
    },
    checkWinner(name) {
      if (!this.content.winning_fighter) {
        return "";
      }

      if (name === this.content.winning_fighter) {
        return "winner";
      } else {
        return "loser";
      }
    }
  }
};
</script>