//const MongoClient=require('mongodb').MongoClient;
const {MongoClient, ObjectID}=require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=>{
  if(err){
    return console.log('Nem sikerült csatlakozni az adatbázishoz');
  }
  console.log('Csatlakozva az adatbázishoz');

  /*db.collection('Todos').deleteMany({text: 'eat lunch'}).then((result)=>{
    console.log(result);
  });*/

  /*db.collection('Todos').deleteOne({text: 'eat lunch'}).then((result)=>{
    console.log(result);
  });*/

  db.collection('Todos').findOneAndDelete({text: 'eat lunch'}).then((result)=>{
    console.log(result);
  });
  //db.close();
});
