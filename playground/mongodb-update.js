//const MongoClient=require('mongodb').MongoClient;
const {MongoClient, ObjectID}=require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=>{
  if(err){
    return console.log('Nem sikerült csatlakozni az adatbázishoz');
  }
  console.log('Csatlakozva az adatbázishoz');

  /*db.collection('Todos').findOneAndUpdate({
    _id: new ObjectID('5992eb164e9354bc547db27e')
  }, {
    $set:{
      completed:true
    }
  }, {
    returnOriginal: false
  }).then((result)=>{
    console.log(result);
  });*/

  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('5992d4c01e8e1724d7b3b2d9')
  }, {
    $set:{
      name:'Charir Ixen Darastrix'
    },
    $inc:{
      age: 1
    }
  }, {
    returnOriginal: false
  }).then((result)=>{
    console.log(result);
  });
  //db.close();
});
