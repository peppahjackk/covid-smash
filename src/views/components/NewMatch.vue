<template>
  <div class="modal-wrapper">
    <div class="modal">
      <div class="modal-body">
        <h1>New Match</h1>
        <div class="form">
          <label for="system">System:</label>
          <input type="text" placeholder="system" id="system" v-model="system" />
          <label for="game">Game:</label>
          <input type="text" placeholder="game" id="game" v-model="game" />
          <label for="stage">Stage: (to make a future, stage should be 'Various')</label>
          <input type="text" placeholder="stage" id="stage" v-model="stage" />
          <label for="fighter1">Fighters:</label>
          <div class="fighter-group">
            <input type="text" v-for="(fighter, i) in fighters" :key="'input-fighter-' + (i + 1)" :placeholder="'fighter' + (i + 1)" :id="'fighter' + i" v-model="fighters[i]" />
            <button @click="fighters.push('')" class="button-small">+ Add fighter</button>
          </div>
          <label for="matchType">Special Rules:</label>
          <input type="text" placeholder="" id="matchType" v-model="matchType" value="" />
          <button @click="submitMatch" class="red">Create</button>
        </div>
      </div>
    </div>
    <div class="modal-overlay" @click="cancelSubmit"></div>
  </div>
</template>

<script>
import crud from "@/mixins/crud";

export default {
  data: function() {
    return {
      game: "Super Smash Bros",
      stage: "",
      system: "N64",
      fighters: ['',''],
      matchType: ''
    };
  },
  mixins: [crud],
  methods: {
    createFighterSchema: function(fighterList) {
      return fighterList.map((fighter)=>{
        return {
          name: fighter,
          placement: null
        }
      })
    },
    submitMatch: function() {
      if (!this.stage || this.fighters.length < 2) return;

      this.fighters = this.fighters.filter(fighter => {
        return fighter.length > 0;
      })

      let nextMatchIdx = this.$root.store.active_data.matches.length + 1;

      let theFighters = this.createFighterSchema(this.fighters);
      
      this.postMatch({
        game: this.game,
        stage: this.stage,
        system: this.system,
        fighters: theFighters,
        match_type: this.matchType,
        match_idx: nextMatchIdx
      }).then(() => {
        this.$root.eventHub.$emit("activeModal", "");
        this.$root.eventHub.$emit("fetchMatches");
      });
    },
    cancelSubmit: function() {
      this.$root.eventHub.$emit("activeModal", "");
    }
  }
};
</script>