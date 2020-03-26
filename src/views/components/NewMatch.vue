<template>
<div class="modal-wrapper">
  <div class="modal">
    <div class="modal-body">
      <h1>New Match</h1>
      <div class="form">
        <label for="stage">Stage:</label>
        <input type="text" placeholder="stage" id="stage" v-model="stage">
          <label for="fighter1">Fighters:</label>
        <div class="fighter-group">
          <input type="text" placeholder="fighter1" id="fighter1" v-model="fighters[0]">
          <input type="text" placeholder="fighter2" id="fighter2" v-model="fighters[1]">
          <input type="text" placeholder="fighter3" id="fighter3" v-model="fighters[2]">
          <input type="text" placeholder="fighter4" id="fighter4" v-model="fighters[3]">
        </div>
        <label for="betAmount">Bet amount:</label>
        <input type="text" placeholder="5" id="betAmount" v-model="betAmount" value="5">
        <button @click="submitMatch" class="red">Create</button>
      </div>
    </div>
  </div>
  <div class="modal-overlay" @click="cancelSubmit"></div>
</div>
</template>

<script>

export default {
  data: function() {
    return {
      stage: '',
      fighters: [],
      betAmount: 5
    }
  },
  methods: {
    submitMatch: function() {
      if (!this.stage || !this.betAmount || this.fighters.length < 2) return;

      this.$root.eventHub.$emit('activeModal', '');
      console.log('TODO add data update');
    },
    cancelSubmit: function() {
      this.$root.eventHub.$emit('activeModal', '');
    }
  }
}
</script>