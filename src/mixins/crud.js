import axios from 'axios';

const crud = {
  methods: {
    updateMatches(data) {
      let sqlData = data;
      sqlData.req = 'update';
      sqlData.table = 'matches';
      console.log(sqlData);
      
      return axios.post('php/crud.php', sqlData)
      .then((results)=>{
        console.log(results)
        return results;
      })
      .catch((error)=>{
        console.error(error)
      })
    },
    postMatch(data) {
      let theFighters = JSON.stringify(data.fighters);
      console.log('poist data', data, theFighters);
      return axios.post('php/crud.php', {
        req: 'insert',
        table: 'matches',
        stage: data.stage,
        fighters: theFighters,
        pick_value: data.pick_value
      })
      .then((results)=>{
        console.log(results)
        return results;
      })
      .catch((error)=>{
        console.error(error)
      })
    },
    postPick(data) {
      console.log('Attempting post:', data);
      let sqlData = data;
      data.req = 'replace';
      data.table = 'picks';
      data.pick_id = data.match_id + '_' + data.user_id;
      data.filter = `pick_id=${data.pick_id}`;
      
      return axios.post('php/crud.php', sqlData)
      .then((results)=>{
        console.log(results)
        return results;
      })
      .catch((error)=>{
        console.error(error)
      })
    },
    getMatches() {
      return axios.post('php/crud.php', {
        table: 'matches'
      })
      .then((results)=>{
        console.log(results.data)
        results.data.forEach((match)=>{
          match.fighters = JSON.parse(match.fighters);
          match.in_progress = parseInt(match.in_progress);
          match.completed = parseInt(match.completed);
          match.pick_value = parseInt(match.pick_value);
        })
        
        return results.data;
      })
      .catch((error)=>{
        console.error(error)
      })
    },
    getData_FAKE(mockData, time = 0) {
      console.log(mockData);
      return new Promise((resolve)=> {
        setTimeout(()=> {

          mockData.data.forEach((match)=>{
            match.fighters = JSON.parse(match.fighters)
          })
          
          resolve(mockData.data)
        },time)
      })
    }
  }
}

export default crud;