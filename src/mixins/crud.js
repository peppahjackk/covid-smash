import axios from 'axios';

const crud = {
  methods: {
    postMatch(data) {
      let theFighters = JSON.stringify(data.fighters);
      console.log('poist data', data, theFighters);
      return axios.post('php/crud.php', {
        req: 'post_match',
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
    getMatches() {
      return axios.post('php/crud.php', {
        table: 'matches'
      })
      .then((results)=>{
        console.log(results.data)
        results.data.forEach((match)=>{
          match.fighters = JSON.parse(match.fighters)
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