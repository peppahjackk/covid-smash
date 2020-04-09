<template>
  <section class="dashboard container">
    <div class="dashboard-body-container">
      <div class="pick-wrapper">
        <div class="hero">
          <div class="title-container">
            <h1 class="title">COVID Smash</h1>
          </div>
          <div class="intro-text content bg-baseAccent">
            <h3>Ever since the COVID-19 isolation period began, the landscape of indoors future of spectator sports has changed forever. We bring you all the rage: CPU controlled Super Smash Bros. matches! Before the fights begin, pick who you think will come out on top of the bout.</h3>
          </div>

          <div class="content flex-content flex-top">
            <div class="content-left">
              <h3>How to play:</h3>
              <ul>
                <li>Choose who you think will win one or all of the following Smash Bros. matches.</li>
                <li>You can change your pick after submitting. Just select a new fighter in the match and submit again</li>
                <li>You are not required to pick every match</li>
              </ul>
            </div>
            <div class="match-rules content-left">
              <h3>Match Rules:</h3>
              <ul>
                <li>Game and system will be listed</li>
                <li>All characters are CPU controlled (max level*)</li>
                <li>4 player free-for-all*</li>
                <li>6 stock* (no time limit)</li>
                <li>Items are OFF*</li>
                <li>Stage selection listed in match description</li>
                <li>Last man/woman/pokemon standing wins*</li>
              </ul>
              <h5>*unless otherwise stated</h5>
            </div>
          </div>
          <h2 class="bg-yellow c-baseAccent">Matches are Friday April 10th @ 9:00pm&nbsp;EST</h2>
          <div class="text-lockup">
            <svg
              class="icon icon-twitch"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 490.69 512"
            >
              <title>Asset 1</title>
              <path
                d="M0,89.07V445.21H122.65V512h67l66.86-66.82H356.84l133.85-133.5V0H33.43ZM78,44.48h368V289.37L368,367.27H245.31L178.45,434V367.27H78Z"
                style="fill: #673ab7"
              />
              <path d="M200.75,133.59h44.58V267.14H200.75Z" style="fill: #673ab7" />
              <path d="M323.37,133.59H368V267.14H323.37Z" style="fill: #673ab7" />
            </svg>
            <h2>
              Watch the matches on
              <a
                href="https://www.twitch.tv/dietwolfcola"
                target="_blank"
                rel="noreferrer"
              >our Twitch stream.</a>
            </h2>
          </div>
        </div>
        <h4>Text Rusty if you have any technical issues, or if you just want to talk about soup.</h4>
        <div class="pick-header">
          <h2
            @click="$root.store.activeView = 'pick'"
            :class="[$root.store.activeView === 'pick' ? 'bg-baseAccent' : '']"
          >Pick some Winners</h2>
          <h2
            @click="$root.store.activeView = 'archive'"
            :class="[$root.store.activeView === 'archive' ? 'bg-baseAccent' : '']"
          >Past Results</h2>
        </div>
        <div class="matchups" v-show="$root.store.activeView === 'pick'">
          <div
            class="matchup-wrapper"
            v-for="(match, i) in $root.store.active_data.matches"
            :key="match.match_id"
          >
            <Matchup :content="match" :fightNumber="i + 1" @pickSelected="selectPicks"></Matchup>
          </div>
          <button class="blue back-to-top" @click="toTop">Back to top</button>
        </div>
        <div class="archive" v-show="$root.store.activeView === 'archive'">
          <div class="matchup-wrapper">
            <table class="results condensed">
              <thead>
                <th>Winner</th>
                <th>Match Type</th>
                <th>Stage</th>
                <th>Fighters</th>
              </thead>
              <tr
                class="result-wrapper"
                v-for="(match) in $root.store.archive_data.matches"
                :key="'match-archive-' + match.match_id"
              >
                <td>{{ match.winning_fighter }}</td>
                <td>{{ match.match_type }}</td>
                <td>{{ match.stage }}</td>
                <td>
                  <span
                    v-for="(fighter) in match.fighters"
                    :key="'archive-' + match.match_id + fighter.name"
                  >{{ fighter.name }}  </span>
                </td>
              </tr>
            </table>
          </div>
        </div>
        <!-- <div class="standings" v-show="$root.store.activeView === 'standings'">
          
        </div> -->
      </div>
      <div ref="sidebar" class="sidebar">
        <h3>Your picks:</h3>
        <div class="sidebar-picks-container">
          <h4>PENDING</h4>
          <table class="sidebar-pick-wrapper">
            <tr>
              <th>Match</th>
              <th>Fighter</th>
            </tr>
            <tr v-for="(pick) in pendingPicks" :key="'pending-' + pick.match_id">
              <td>{{pick.match_idx}}</td>
              <td>{{pick.fighter}}</td>
            </tr>
          </table>
          <!-- <p>Total picks: {{ pendingPicks.length }}</p> -->
          <button @click="submitPicks()" :class="[betsClosed ? 'disabled' : '']">Submit picks!</button>
        </div>
        <div class="sidebar-picks-container">
          <h4>SUBMITTED</h4>
          <table class="sidebar-pick-wrapper">
            <tr>
              <th>Match</th>
              <th>Fighter</th>
            </tr>
            <tr v-for="(pick) in $root.store.User.picks" :key="pick.match_id + 'submitted'">
              <td>{{pick.match_idx}}</td>
              <td>{{pick.fighter}}</td>
            </tr>
          </table>
          <p>Total picks: {{ userPicks.length }}</p>
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
      if (this.$root.store.User && this.$root.store.User.picks) {
        return this.$root.store.User.picks;
      }

      return [];
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

      this.pendingPicks[matchName] = pick;

      this.$forceUpdate();
      // let vnmName = this.$root.store.User.vnm;
      // this.pendingPicks[matchName].vnm = vnmName;
    },
    submitPicks: function() {
      console.log("Submit picks fired");
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
        behavior: "smooth"
      });
    }
  },
  components: {
    Matchup
  },
  watch: {
    pendingPicks() {
      console.log("pending picks changed");
    }
  }
};
</script>