import axios from 'axios';

const crud = {
  methods: {
    getActive() {
      return axios.post('php/crud.php', {
        table: 'active'
      })
      .then((results)=>{
        console.log(results.data)
        results.data[0].fighters = JSON.parse(results.data[0].fighters)
        return results.data[0];
      })
      .catch((error)=>{
        console.error(error)
      })
    },
    getData_FAKE(mockData, time = 0) {
      return new Promise((resolve)=> {
        setTimeout(()=> {
          mockData.data[0].fighters = JSON.parse(mockData.data[0].fighters)
          
          resolve(mockData.data[0])
        },time)
      })
    }
  }
}

export default crud;