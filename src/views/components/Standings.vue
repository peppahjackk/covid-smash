<template>
  <div class="standings-wrapper">
    <table class="standings condensed alternating">
      <thead>
        <th>Rank</th>
        <th>Fighter</th>
        <th>
          Placement
          <br />(1st / 2nd / 3rd / 4th)
        </th>
        <th>Total Matches</th>
        <th>Points<br>
        (1st / 2nd / 3rd / 4th)<br>
        4 / 3 / 2 / 1
        </th>
      </thead>
      <tr
        v-for="(fighter, index) in processStandings($root.store.archive_data.matches)"
        :key="system + '-fighter-' + fighter.name"
      >
        <td>{{ index + 1 }}</td>
        <td>{{ fighter.name }}</td>
        <td>{{ fighter.record[0] }} / {{ fighter.record[1] }} / {{ fighter.record[2] }} / {{ fighter.record[3] }}</td>
        <td> {{ fighter.record.reduce(reducer) }}
        <td>{{ fighter.totalPoints }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import utils from '@/mixins/utils';

export default {
  props: {
    system: {
      type: String,
      default: "N64"
    },
    game: {
      type: String,
      default: "super smash"
    }
  },
  mixins: [utils],
  computed: {
    fighterList: function() {
      return this.$root.store.archive_data.matches;
    }
  },
  methods: {
    processStandings: function(matches) {
      let standings = [];
      let fighterList = {};
      matches.forEach(match => {
        if (match.system.toLowerCase() != this.system.toLowerCase()) return;
        if (!match.show_in_standings) return

        for (let fighter of match.fighters) {

          if (Object.keys(fighterList).indexOf(fighter.name) < 0) {
            fighterList[fighter.name] = {
              name: fighter.name,
              record: [0, 0, 0, 0]
            };
          }

          fighterList[fighter.name].record[fighter.placement - 1]++;
        }
      });

      Object.keys(fighterList).forEach((fighter) => {
        fighterList[fighter].averagePlacement = this.calculateAvgPlacement(fighterList[fighter]);
        fighterList[fighter].totalPoints = this.calculatePoints(fighterList[fighter]);
        standings.push(fighterList[fighter]);
      });

      standings = standings.sort((a, b) => {
          return b.totalPoints - a.totalPoints;
      });

      return standings;
    },
    calculateAvgPlacement: function(fighter) {
      let totalFights = fighter.record.reduce(this.reducer);

      let cumulativeFinish = fighter.record.reduce(
        (accumulator, currentValue, index) => {
          return currentValue * (index + 1) + accumulator;
        }
      );

      return Math.round((cumulativeFinish / totalFights) * 1e2) / 1e2;
    },
    calculatePoints: function(fighter) {
      let newPoints = 0;

      for (let i = 0; i < fighter.record.length; i++) {
        newPoints += fighter.record[i] * ((i - 4) * -1);
      }

      return newPoints;
    }
  }
};
</script>