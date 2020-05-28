<template>
  <section class="admin" v-if="$root.store.User.isAdmin">
    <NewMatch v-if="activeModal === 'newMatch'"></NewMatch>
    <h1>ADMIN</h1>
    <button
      @click="toggleBets"
      :class="[betsOpen ? '' : 'red']"
    >{{ betsOpen ? 'Open': 'Close'}} bets</button>
    <div class="pick-header">
      <h2
        @click="$root.store.activeView = 'home'"
        :class="[$root.store.activeView === 'home' ? 'bg-baseAccent' : '']"
      >Active Matches</h2>
      <h2
        @click="$root.store.activeView = 'archive'"
        :class="[$root.store.activeView === 'archive' ? 'bg-baseAccent' : '']"
      >Archive</h2>
    </div>
    <div class="active-match-wrapper">
      <div class="matchups">
        <table>
          <thead>
            <th class="short">Id</th>
            <th class="digit">#</th>
            <th>System<br>Game</th>
            <th>Stage<br>Rules</th>
            <th>Total Picks</th>
            <th>Picks / Fighter / To Win / Placement</th>
            <th class="medium">Picks<br>O: Open<br>X: Closed</th>
            <th class="short">Complete</th>
            <th class="short">Standings</th>
            <th class="short">Archive</th>
            <th>Actions</th>
          </thead>
          <MatchAdmin
            v-show="$root.store.activeView === 'home'"
            class="matchup-wrapper"
            v-for="(match, i) in $root.store.active_data.matches"
            :content="match"
            :pickNames="$root.store.active_data.pickNames"
            :fightNumber="i + 1"
            :key="match.id"
          ></MatchAdmin>
          <MatchAdmin
            v-show="$root.store.activeView === 'archive'"
            class="matchup-wrapper"
            v-for="(match, i) in $root.store.archive_data.matches"
            :content="match"
            :fightNumber="i + 1"
            :key="match.id"
          ></MatchAdmin>
          <tr v-show="$root.store.activeView === 'home'">
            <td colspan="11">
              <button @click="addMatch">+Add Match</button>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <div class="user-list" v-if="$root.store.active_data.picks && !$root.store.active_data.picks['undefined']">
        <UserPicks
          v-for="(picker) in Object.keys($root.store.active_data.picks)" 
          :key="'active-' + picker"
          :content="$root.store.active_data.picks[picker]"
          :picker="$root.store.active_data.picks[picker].name"
          @delete="ON_PICK_DELETE"></UserPicks>
    </div>
  </section>
</template>

<script>
import NewMatch from "@/views/components/NewMatch";
import MatchAdmin from "@/views/components/MatchAdmin";
import UserPicks from "@/views/components/UserPicks";
import crud from "@/mixins/crud.js";

export default {
  components: {
    MatchAdmin,
    NewMatch,
    UserPicks
  },
  data: function() {
    return {
      activeModal: null
    };
  },
  computed: {
    betsOpen: function() {
      if (this.$root.store.active_data.matches.length > 0) {
        return this.$root.store.active_data.matches[
          this.$root.store.active_data.matches.length - 1
        ].in_progress;
      } else {
        return 0;
      }
    }
  },
  mounted: function() {
    console.log(this.$root.store.active_data.picks);
  },
  mixins: [crud],
  methods: {
    addMatch: function() {
      this.$root.eventHub.$emit("activeModal", "newMatch");
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

      this.updateMatches({
        in_progress: newBetsOpen,
        filter: "complete=0"
      }).then(results => {
        console.log(results);

        this.betsOpen = !this.betsOpen;
        this.updating = false;

        this.$root.eventHub.$emit("fetchMatches");
        this.$root.eventHub.$on("fetchMatches_COMPLETE", () => {
          this.$forceUpdate();
        });
      });
    },
    ON_PICK_DELETE: function(pick) {
      let confirmed = confirm(
        `Are you sure you'd like to delete ${pick.name}'s pick of ${pick.fighter} in match ${pick.match_id}?`
      );
      if (!confirmed) return;

      console.log("PICK DELETE");
      this.deleteRow({
        req: "delete",
        table: "picks",
        filter: `pick_id='${pick.pick_id}'`
      }).then(results => {
        console.log(results);
        this.$root.eventHub.$emit("fetchMatches");
      });
    }
  },
};
</script>