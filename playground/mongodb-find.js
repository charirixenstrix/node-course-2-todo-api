//const MongoClient=require('mongodb').MongoClient;
const {MongoClient, ObjectID}=require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=>{
  if(err){
    return console.log('Nem sikerült csatlakozni az adatbázishoz');
  }
  console.log('Csatlakozva az adatbázishoz');
  //id esetén: {_id: new ObjectID('ide az id-t')}
  /*db.collection('Todos').find({completed: false}).toArray().then((docs)=>{
    console.log('Todos');
    console.log(JSON.stringify(docs, undefined, 2));
  }, (err)=>{
    console.log('nem sikerült a lekérdezés');
  });*/
  db.collection('Todos').find().count().then((count)=>{
    console.log(`Todos count: ${count}`);

  }, (err)=>{
    console.log('nem sikerült a lekérdezés');
  });
  //db.close();
});
