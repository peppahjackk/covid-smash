<template>
<div
class="user-list-row" 
>
  <div class="user-header table-header">
    <h3 class="bg-blue">{{ content[0].name }}</h3>
    <h3>Active picks: {{ content.length }}</h3>
    <h3>Winnings: {{(netGain).toFixed(2)}}</h3>
    <table class="minimal">
      <thead>
        <th>Paid up</th>
        <th>Settled debts</th>
      </thead>
      <tr>
        <td>
          <input class="m-0" type="checkbox" />
        </td>
        <td>
          <input class=m-0 type="checkbox" />
        </td>
      </tr>
    </table>
  </div>
  <div class="user-info-header">
    <div>Match Id</div>
    <div>Fighter</div>
    <div>Result</div>
    <div>Winnings</div>
    <div>Actions</div>
  </div>
  <div class="user-info-picks" v-for="(pick, i) in content" :key="'active-' + picker + '-' + i">
    <div>{{pick.match_id}}</div>
    <div>{{pick.fighter}}</div>
    <div v-if="$root.store.active_data.matchResults['match-' + pick.match_id] && $root.store.active_data.matchResults['match-' + pick.match_id].winner">
      <div v-if="$root.store.active_data.matchResults['match-' + pick.match_id].winner === pick.fighter" class="bg-green">W</div>
      <div v-else class="bg-red">L</div>
    </div>
    <div v-else>n/a</div>
    <div v-if="$root.store.active_data.matchResults['match-' + pick.match_id] && $root.store.active_data.matchResults['match-' + pick.match_id].winner">
      <div v-if="$root.store.active_data.matchResults['match-' + pick.match_id].winner === pick.fighter" class="bg-green">{{ ($root.store.active_data.matchResults['match-' + pick.match_id][pick.fighter].toWin).toFixed(2) }}</div>
      <div v-else class="bg-red">0</div>
    </div>
    <div v-else>n/a</div>
    <div class="action-container">
      <div @click="$emit('delete', pick)">
        <svg
          class="icon icon-default icon-trash"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 418.17 512"
        >
          <title>icon-trash</title>
          <path
            d="M416.88,114.44,405.57,80.55A31.52,31.52,0,0,0,375.63,59h-95V28a28.06,28.06,0,0,0-28-28h-87a28.06,28.06,0,0,0-28,28V59h-95A31.54,31.54,0,0,0,12.6,80.55L1.3,114.44a25.37,25.37,0,0,0,24.06,33.4H37.18l26,321.6A46.54,46.54,0,0,0,109.29,512H314.16a46.52,46.52,0,0,0,46.1-42.56l26-321.6h6.54a25.38,25.38,0,0,0,24.07-33.4ZM167.56,30h83.06V59H167.56Zm162.8,437a16.36,16.36,0,0,1-16.2,15H109.29a16.36,16.36,0,0,1-16.2-15L67.27,147.84h288.9ZM31.79,117.84l9.27-27.79A1.56,1.56,0,0,1,42.55,89H375.63a1.55,1.55,0,0,1,1.48,1.07l9.27,27.79Z"
          />
          <path
            d="M282.52,466l.79,0a15,15,0,0,0,15-14.22l14.09-270.4a15,15,0,0,0-30-1.56L268.32,450.2A15,15,0,0,0,282.52,466Z"
          />
          <path
            d="M120.57,451.79a15,15,0,0,0,15,14.19c.28,0,.56,0,.83,0a15,15,0,0,0,14.16-15.79l-14.75-270.4a15,15,0,1,0-30,1.63Z"
          />
          <path
            d="M209.25,466a15,15,0,0,0,15-15V180.58a15,15,0,0,0-30,0V451A15,15,0,0,0,209.25,466Z"
          />
        </svg>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
    props: {
      content: Array,
      picker: String
    },
    computed: {
    
      netGain: function() {
        let gain = 0;

        if (!this.$root.store.active_data.matchResults) return;
        
        for (let pick of this.content) {
          if (this.$root.store.active_data.matchResults['match-'+pick.match_id]) {
            if (this.$root.store.active_data.matchResults['match-'+pick.match_id][pick.fighter].placement === 1) {
              console.log('winner', gain);
              gain += this.$root.store.active_data.matchResults['match-'+pick.match_id][pick.fighter].toWin;
              console.log('winner', gain);

            } else {
              // gain -= 5;
            }
          }
        }

        return gain;
      }
    }
}
</script>