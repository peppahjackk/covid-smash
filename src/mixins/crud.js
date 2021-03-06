import axios from 'axios';

const crud = {
  methods: {
    updateMatches(data) {
      let sqlData = data;

      if (sqlData.fighters) sqlData.fighters = JSON.stringify(sqlData.fighters);

      sqlData.req = 'update';
      sqlData.table = 'matches';

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

      return axios.post('php/crud.php', {
        req: 'insert',
        table: 'matches',
        game: data.game,
        system: data.system,
        stage: data.stage,
        fighters: theFighters,
        match_idx: data.match_idx,
        match_type: data.match_type
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
    putUser(data) {
      let sqlData = data;
      sqlData.table = 'users';
      sqlData.req = 'put';
      
      return axios.post('php/crud.php', sqlData)
      .then((results)=>{
        console.log(results)
        return results;
      })
      .catch((error)=>{
        console.error(error)
      })
    },
    getMatches(archive = false, page = null, numPerPage = 10) {
      let sqlConfig = {
        table: 'matches',
        sort: 'match_id ASC',
        filter: 'hidden=0'
      }

      if (archive) {
        sqlConfig.filter = 'hidden=1';
        sqlConfig.sort = 'match_id DESC';
      }

      if (page != null) {
        sqlConfig.limit = `${page * numPerPage},${numPerPage}`;
      }

      return axios.post('php/crud.php', sqlConfig)
      .then((results)=>{
        if (typeof results.data === 'string') return [];

        results.data.forEach((match)=>{
          match.fighters = JSON.parse(match.fighters);
          match.in_progress = parseInt(match.in_progress);
          match.complete = parseInt(match.complete);
          match.show_in_standings = parseInt(match.show_in_standings);
        })
        
        return results.data;
      })
      .catch((error)=>{
        console.error(error)
      })
    },
    getPicks(idArray) {
      let match_ids = idArray.map((value)=>{
        return value.match_id;
      })

      match_ids = '(' + match_ids.toString() + ')';


      return axios.post('php/crud.php', {
        table: 'picks',
        filter: `match_id in ${match_ids}`
      })
      .then((results)=>{
        return results.data
      })
      .catch((error)=>{
        console.error(error)
      })
    },
    deleteRow(data) {
      return axios.post('php/crud.php', data)
      .then((results) => {
        return results.data;
      })
      .catch((error)=>{
        console.error(error);
      })
    },
    getData_FAKE(mockData, time = 0) {
      return new Promise((resolve)=> {
        setTimeout(()=> {
          resolve(mockData.data)
        },time)
      })
    },
  }
}

export default crud;