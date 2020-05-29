import firebase from 'firebase/app';
import 'firebase/firestore';

const fb = {
    methods: {
        getMeta() {
            return firebase.firestore().collection('user_meta').get()
            .then(data => {
              let newMeta = {};
                  newMeta.data = data.docs;
        
                  newMeta.names = data.docs.map(doc => {
                    if (doc.exists) {
                      return doc.data().name
                    }
                  })
        
                  return newMeta;
            })
            .catch(err => {
              console.log(err);
            })
        },
        addMeta(userMeta) {
            return firebase.firestore().collection('user_meta').add(userMeta)
            .then(result => {
                console.log(result);
            })
            .catch (err => {
                console.error(err);
            })
        }
    }
}

export default fb