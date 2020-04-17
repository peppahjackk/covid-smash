<template>
  <tr class="match-admin-row" :class="{ disabled: !isEditing }">
    <td class="short">
      {{ matchData.match_id }}
    </td>
    <td class="digit">
      <input type="text" v-model="matchData.match_idx" :disabled="!isEditing" />
    </td>
    <td class="medium">
			<input type="text" v-model="matchData.system" :disabled="!isEditing" />
		</td>
    <td>
      <input type="text" v-model="matchData.game" :disabled="!isEditing" />
    </td>
    <td>
      <input type="text" v-model="matchData.stage" :disabled="!isEditing" />
    </td>
    <td class="fighters">
      <div class="fighters-wrapper">
        <div v-for="(fighter) in matchData.fighters" :key="matchData.match_id + fighter.name">
          <input type="text" v-model="fighter.name" :disabled="!isEditing" />
          <input class="digit" type="text" size="2" v-model="fighter.placement" :disabled="!isEditing" />
        </div>
      </div>
    </td>
    <td>
      <input type="text" v-model="matchData.match_type" :disabled="!isEditing" />
    </td>
   <td class="short">
      {{ matchData.in_progress ? 'X' : 'O' }}
    </td>
    <td class="short">
			<input type="checkbox" v-model="matchData.complete" :disabled="!isEditing" />
		</td>
    <td class="short">
			<input type="checkbox" v-model="matchData.show_in_standings" :disabled="!isEditing" />
    </td>
    <td class="short">
			<input type="checkbox" v-model="matchData.hidden" :disabled="!isEditing" />
    </td>
    <td>
      <div class="action-container">
        <div
          class="edit-container"
          @click="ON_EDIT"
        >{{ isEditing ? '&times;' : 'Edit' }}</div>
        <div class="icon-container" v-on="{ click: isEditing && ON_SAVE }">
          <svg class="icon icon-default icon-save" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <title>icon-save</title>
            <path d="M506.51,124.12,387.88,5.49h0A18.81,18.81,0,0,0,374.63,0H18.73A18.74,18.74,0,0,0,0,18.73V493.27A18.74,18.74,0,0,0,18.73,512H493.27A18.74,18.74,0,0,0,512,493.27V137.37A18.71,18.71,0,0,0,506.51,124.12ZM156.1,37.46H355.9V148.29H156.1ZM400.45,474.54H111.55V316.93h288.9Zm74.09,0H437.91V298.2a18.73,18.73,0,0,0-18.73-18.73H92.82A18.73,18.73,0,0,0,74.09,298.2V474.54H37.46V37.46h81.17V167a18.74,18.74,0,0,0,18.74,18.73H374.63A18.74,18.74,0,0,0,393.37,167V64l81.17,81.18Z" />
            <path d="M309.51,55a18.74,18.74,0,0,0-18.73,18.74V112a18.74,18.74,0,1,0,37.47,0V73.75A18.74,18.74,0,0,0,309.51,55Z" />
          </svg>
        </div>
        <div @click="ON_DELETE" v-if="$root.store.activeView === 'archive'">
					<svg class="icon icon-default icon-trash" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 418.17 512">
						<title>icon-trash</title>
						<path d="M416.88,114.44,405.57,80.55A31.52,31.52,0,0,0,375.63,59h-95V28a28.06,28.06,0,0,0-28-28h-87a28.06,28.06,0,0,0-28,28V59h-95A31.54,31.54,0,0,0,12.6,80.55L1.3,114.44a25.37,25.37,0,0,0,24.06,33.4H37.18l26,321.6A46.54,46.54,0,0,0,109.29,512H314.16a46.52,46.52,0,0,0,46.1-42.56l26-321.6h6.54a25.38,25.38,0,0,0,24.07-33.4ZM167.56,30h83.06V59H167.56Zm162.8,437a16.36,16.36,0,0,1-16.2,15H109.29a16.36,16.36,0,0,1-16.2-15L67.27,147.84h288.9ZM31.79,117.84l9.27-27.79A1.56,1.56,0,0,1,42.55,89H375.63a1.55,1.55,0,0,1,1.48,1.07l9.27,27.79Z"/>
						<path d="M282.52,466l.79,0a15,15,0,0,0,15-14.22l14.09-270.4a15,15,0,0,0-30-1.56L268.32,450.2A15,15,0,0,0,282.52,466Z"/>
						<path d="M120.57,451.79a15,15,0,0,0,15,14.19c.28,0,.56,0,.83,0a15,15,0,0,0,14.16-15.79l-14.75-270.4a15,15,0,1,0-30,1.63Z"/>
						<path d="M209.25,466a15,15,0,0,0,15-15V180.58a15,15,0,0,0-30,0V451A15,15,0,0,0,209.25,466Z"/>
					</svg>
        </div>
      </div>
    </td>
  </tr>
</template>

<script>
import crud from '../../mixins/crud';

export default {
  props: {
    content: Object
  },
  mixins: [crud],
  data: function() {
    return {
      isEditing: false,
      tempFighters: this.content.fighters,
      matchData: {},
      hasEdited: false
    };
  },
  methods: {
    ON_SAVE: function(e) {
      console.log("save: ", e);
      this.hasEdited = false;
      this.isEditing = !this.isEditing;


      let updatedMatchData = {
        filter: `match_id=${this.content.match_id}`
      };


      let matchDataKeys = Object.keys(this.matchData);

      for (const key of matchDataKeys) {
        if (typeof this.matchData[key] === 'object') {
          if (JSON.stringify(this.matchData[key]) != JSON.stringify(this.content[key])) {
            updatedMatchData[key] = JSON.stringify(this.matchData[key]);
          }
        } else if (this.matchData[key] != this.content[key]) {
          updatedMatchData[key] = this.matchData[key]
        }
      }

      this.updateMatches(updatedMatchData).then(() => {
        if (updatedMatchData.hidden) {
          location.reload();
        }
        this.$root.eventHub.$emit("fetchMatches");
      });
    },
    ON_EDIT: function() {
			if (this.isEditing) {
				this.matchData = this.content;
			}
      this.isEditing = !this.isEditing;
    },
    ON_DELETE: function() {
      if (this.isEditing) return;

      let confirmed = confirm(`Are you sure you'd like to delete ${this.content.game} match #${this.content.match_id} on ${this.content.system} @ ${this.content.stage}?`);
      if (!confirmed) return;
      
      console.log('MATCH DELETE');
      this.deleteRow({
        req: 'delete',
        table: 'matches',
        filter: `match_id='${this.content.match_id}'`
      })
      .then( results => {
        console.log(results);
        location.reload();
      })
    }
  },
  mounted: function() {
    let tempObj = {};
    let tempFighters = {};

    // The matchData objects cannot be references to content, so lets make them unique
    this.matchData = Object.assign(tempObj, this.content);
    this.matchData.fighters = Object.assign(tempFighters, this.content.fighters)
  }
};
</script>