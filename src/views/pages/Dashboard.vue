<template>
  <section class="dashboard container">
    <div class="dashboard-body-container">
      <div class="pick-wrapper">
        <div class="hero">
          <h1 class="title">COVID Smash</h1>
          <div class="text-lockup">
            <svg class="icon icon-twitch" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 490.69 512" >
              <title>Asset 1</title>
              <path d="M0,89.07V445.21H122.65V512h67l66.86-66.82H356.84l133.85-133.5V0H33.43ZM78,44.48h368V289.37L368,367.27H245.31L178.45,434V367.27H78Z" style="fill: #673ab7" />
              <path d="M200.75,133.59h44.58V267.14H200.75Z" style="fill: #673ab7" />
              <path d="M323.37,133.59H368V267.14H323.37Z" style="fill: #673ab7" />
            </svg>

            <h2>
              The Twitch stream
              <a href="https://www.twitch.tv/dietwolfcola" target="_blank" rel="noreferrer" >can be found here.</a>
            </h2>
          </div>
          <div class="flex-content">
            <div class="content-right">
              <h4>Match Rules:</h4>
              <ul>
                <li>4 player free-for-all with max level CPU characters</li>
                <li>6 stock (no time limit)</li>
                <li>Items are OFF</li>
                <li>Levels are pre-chosen</li>
                <li>Last man/woman/pokemon standing wins</li>
              </ul>
            </div>
            <div class="content-left">
              <h4>Wagers:</h4>
              <ul>
                <li>All bets are $5.00 USD</li>
                <li>All bettors of the winning character split the total pot for that match</li>
                <li>Venmo me (@hustlerussell) before the matches; I will pay out the winners</li>
                <li>All betting closes prior to 9pm (for all matches)</li>
                <li>Bets currently cannot be deleted</li>
                <li>You can change your bet after submitting. Just select a new fighter in the match and submit again</li>
                <li>You are not required to bet on every match</li>
              </ul>
            </div>
          </div>
          <h4 class="disclaimer">Not paying up or trying to game the system will result in all of your bets being voided and being blacklisted from future events.</h4>
          <h4>Any technical issues please let Rusty know.</h4>
        </div>
        <div class="pick-header">
          <h2 class="bg-baseAccent">Choose your character!</h2>
        </div>
        <div class="matchups">
          <div
            class="matchup-wrapper"
            v-for="(match) in $root.store.active_data.matches"
            :key="match.match_id"
          >
            <Matchup :content="match" :fightNumber="match.match_id" @pickSelected="selectPicks"></Matchup>
          </div>
          <button class="blue back-to-top" @click="toTop">Back to betslip ^</button>
        </div>
      </div>
      <div ref="sidebar" class="sidebar">
        <h3>Your bets:</h3>
        <div class="sidebar-picks-container">
          <h4>PENDING</h4>
          <table v-for="(pick) in pendingPicks" :key="pick.match_id" class="sidebar-pick-wrapper">
            <tr>
              <td>Match</td>
              <td>{{pick.match_id}}</td>
            </tr>
            <tr>
              <td>Fighter</td>
              <td>{{pick.fighter}}</td>
            </tr>
            <tr>
              <td>Amount</td>
              <td>${{pick.pick_value}}</td>
            </tr>
          </table>
          <p>Pending bet amount: ${{ getTotalBet(pendingPicks) }}</p>
          <h5>Please pay @hustlerussell prior to game start to be eligible for winnings.</h5>
          <button @click="submitPicks()" :class="[betsClosed ? 'disabled' : '']">Submit picks!</button>
        </div>
        <div class="sidebar-picks-container">
          <h4>SUBMITTED</h4>
          <table
            v-for="(pick) in $root.store.User.picks"
            :key="pick.match_id + 'submitted'"
            class="sidebar-pick-wrapper"
          >
            <tr>
              <td>Match</td>
              <td>{{pick.match_id}}</td>
            </tr>
            <tr>
              <td>Fighter</td>
              <td>{{pick.fighter}}</td>
            </tr>
            <tr>
              <td>Amount</td>
              <td>${{pick.pick_value}}</td>
            </tr>
          </table>
          <h5>Please pay @hustlerussell prior to game start to be eligible for winnings.</h5>
          <p>Submitted bet amount: ${{ getTotalBet($root.store.User.picks) }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Matchup from "@/views/components/Matchup";
import crud from "@/mixins/crud";

export default {
  data: function() {
    return {
      pendingPicks: {}
    };
  },
  computed: {
    userPicks: function() {
      return this.$root.store.User.picks;
    },
    betsClosed: function() {
      if (this.$root.store.active_data.matches.length > 0) {
        return this.$root.store.active_data.matches[
          this.$root.store.active_data.matches.length - 1
        ].in_progress;
      } else {
        return 0;
      }
    }
  },
  mixins: [crud],
  methods: {
    selectPicks: function(pick) {
      let matchName = "match" + pick.match_id;

      if (pick.delete) {
        delete this.pendingPicks[matchName];
        return;
      }

      let venmoName = this.$root.store.User.venmo;

      this.pendingPicks[matchName] = pick;
      this.pendingPicks[matchName].venmo = venmoName;
    },
    submitPicks: function() {
      for (let pick in this.pendingPicks) {
        let pickIdx = Object.keys(this.pendingPicks).indexOf(pick);
        let lastPick = false;

        if (pickIdx === this.pendingPicks.length - 1) {
          lastPick = true;
        }

        this.postPick(this.pendingPicks[pick]).then(result => {
          console.log(result);
          delete this.pendingPicks[pick];

          if (lastPick) this.$root.eventHub.$emit("fetchMatches");
        });
      }
    },
    getTotalBet: function(picks) {
      let total = 0;
      for (let i in picks) {
        total += parseInt(picks[i].pick_value);
      }
      return total;
    },
    toTop: function() {
      let sidebarBox = this.$refs.sidebar.getBoundingClientRect();

      window.scrollTo({
        top: sidebarBox.top,
        behavior: 'smooth'
      });
    }
  },
  components: {
    Matchup
  }
};
</script>