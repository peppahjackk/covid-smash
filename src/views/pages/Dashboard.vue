<template>
  <section class="dashboard container">
    <div class="dashboard-body-container">
      <div class="pick-wrapper">
        <div class="hero">
          <div class="title-container">
            <h1>Friday Night Fights</h1>
          </div>
          <div class="description b-yellow">
            <h2>CPU vs CPU Super Smash Bros Matches and more!</h2>
            <h3>Starting quarantined Fridays @ 9:00pm&nbsp;EST (usually about 1 hour)</h3>
          </div>
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
              Watch on
              <a
                href="https://www.twitch.tv/dietwolfcola"
                target="_blank"
                rel="noreferrer"
              >our Twitch stream.</a>
            </h2>
          </div>
        </div>
        <div class="pick-header">
          <h2
            @click="$root.store.activeView = 'home'"
            :class="[$root.store.activeView === 'home' ? 'bg-baseAccent' : '']"
          >Pick Winners</h2>
          <h2
            @click="$root.store.activeView = 'results'"
            :class="[$root.store.activeView === 'results' ? 'bg-baseAccent' : '']"
          >Results</h2>
          <h2
            v-if="false"
            @click="$root.store.activeView = 'standings'"
            :class="[$root.store.activeView === 'standings' ? 'bg-baseAccent' : '']"
          >Standings</h2>
          <h2
            v-if="$root.store.future_data.matches"
            @click="$root.store.activeView = 'futures'"
            :class="[$root.store.activeView === 'futures' ? 'bg-baseAccent' : '']"
          >Playoffs</h2>
          <h2
            v-if="false"
            @click="$root.store.activeView = 'previews'"
            :class="[$root.store.activeView === 'previews' ? 'bg-baseAccent' : '']"
          >Match Previews</h2>
        </div>
        <div class="matchups" v-show="$root.store.activeView === 'home'">
          <div v-if="$root.store.active_data.matches.length > 0">
            <div
              class="matchup-wrapper"
              v-for="(match, i) in $root.store.active_data.matches"
              :key="match.match_id"
            >
              <Matchup :content="match" :fightNumber="i + 1" @pickSelected="selectPicks"></Matchup>
            </div>
          </div>
          <div class="m-lr-md m-b-md p-lg b-baseAccent" v-else>
            <h3>Sorry, there are no matches scheduled at this time!</h3>
          </div>
          <button class="blue back-to-top" @click="toTop">Back to top</button>
        </div>
        <div class="matchups m-lr-md b-baseAccent" v-show="$root.store.activeView === 'futures'">
          <div class="p-lr-md">
            <div class="bg-blue m-lr-md p-md cta">
              <div class="text-container">
                <h2>8 players enter, but only one will be the ultimate N64 Smash fighter.</h2>

                <h3
                  class="left"
                >For 3 weeks, beginning 06/05/20, the fighters will duke it out 1v1 in Best of 3 format, loser goes home, until we crown the ultimate smash fighter.</h3>
              </div>
            </div>
          </div>
          <div class="cta p-lr-md">
              <h2
                class="bg-green p-sm"
              >Fox is your winner!</h2>
            <img src="@/assets/bracket_finished-clear.png" />
          </div>
          <div
            class="matchup-wrapper"
            v-for="(match) in $root.store.future_data.matches"
            :key="match.match_id"
          >
            <Matchup :content="match" @pickSelected="selectPicks"></Matchup>
          </div>
        </div>
        <div class="results" v-show="$root.store.activeView === 'results'">
          <div
            class="matchup-wrapper"
            v-for="(match, i) in $root.store.archive_data.matches"
            :key="match.match_id"
          >
            <Matchup archive :content="match" :fightNumber="i + 1" @pickSelected="selectPicks"></Matchup>
          </div>
          <div class="page-selection" v-if="$root.store.archive_data.matches.length">
            <h3>Pages:</h3>
            <div
              class="page-selector-container"
              v-for="(i) in numMatches"
              :key="i"
            >
              <button 
                :class="[ i === $root.store.activeArchivePage ? 'green' : 'base-accent' ]"
                class="button-small"
                @click="onPageSelection(i)">
                {{ i + 1 }}
              </button>
            </div>
          </div>
        </div>
        <div class="standings" v-show="$root.store.activeView === 'standings'">
          <div class="matchup-wrapper">
            <div class="inner-tab-wrapper pick-header">
              <h2
                @click="$root.store.activeTab = 'n64'"
                :class="[$root.store.activeTab === 'n64' ? 'bg-baseAccent' : '']"
                class="underline inner-tab-selection"
              >N64</h2>
              <h2
                @click="$root.store.activeTab = 'gamecube'"
                :class="[$root.store.activeTab === 'gamecube' ? 'bg-baseAccent' : '']"
                class="underline inner-tab-selection"
              >Gamecube</h2>
            </div>
            <Standings v-show="$root.store.activeTab === 'n64'" system="n64" game="super smash"></Standings>
            <Standings
              v-show="$root.store.activeTab === 'gamecube'"
              system="GC"
              game="super smash"
            ></Standings>
          </div>
        </div>
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
            <tr v-for="(pick) in $root.store.pendingPicks" :key="'pending-' + pick.match_id">
              <td>{{pick.match_idx}}</td>
              <td>{{pick.fighter}}</td>
            </tr>
          </table>
          <!-- <p>Total picks: {{ pendingPicks.length }}</p> -->
          <button v-if="$root.store.User && $root.store.User.loggedIn" @click="submitPicks()" :class="[betsClosed ? 'disabled' : '']">Submit picks!</button>
          <button v-else @click="$router.push({name: 'Login'})" class="yellow">Login to pick</button>
          <h4 class="p-sm">Text Rusty with technical issues, or about his favorite soup.</h4>
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
import Standings from "@/views/components/Standings";
import crud from "@/mixins/crud";

export default {
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
    },
    numMatches: function() {
      return [0,1,2,3,4,5,6,7,8,9]
    }
  },
  mixins: [crud],
  methods: {
    selectPicks: function(pick) {
      let matchName = "match" + pick.match_id;

      if (pick.delete) {
        delete this.$root.store.pendingPicks[matchName];
        return;
      }

      this.$root.store.pendingPicks[matchName] = pick;

      this.$forceUpdate();
      // let vnmName = this.$root.store.User.vnm;
      // this.$root.store.pendingPicks[matchName].vnm = vnmName;
    },
    onPageSelection: function(i) {
      this.$root.store.activeArchivePage = i;
      this.$root.eventHub.$emit('fetchArchive');
    },
    submitPicks: function() {
      for (let pick in this.$root.store.pendingPicks) {
        let pickIdx = Object.keys(this.$root.store.pendingPicks).indexOf(pick);
        let lastPick = false;

        if (pickIdx === Object.keys(this.$root.store.pendingPicks).length - 1) {
          lastPick = true;
        }

        this.postPick(this.$root.store.pendingPicks[pick]).then(result => {
          console.log(result);
          delete this.$root.store.pendingPicks[pick];

          if (lastPick) {
            this.$root.eventHub.$emit("fetchMatches");

            this.$root.eventHub.$once("fetchMatches_COMPLETE", () => {
              this.$root.eventHub.$emit("picksSubmitted_COMPLETE");
            });
          }
        });
      }
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
    Matchup,
    Standings
  },
  watch: {
    pendingPicks() {
      console.log("pending picks changed");
    }
  }
};
</script>