//const MongoClient=require('mongodb').MongoClient;
const {MongoClient, ObjectID}=require('mongodb');

//var obj=new ObjectID();
//console.log(obj);

/*var user={name:'Chari', age: 30};
var {name}=user;
console.log(name);*/

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=>{
  if(err){
    return console.log('Nem sikerült csatlakozni az adatbázishoz');
  }
  console.log('Csatlakozva az adatbázishoz');

  /*db.collection('Todos').insertOne({
    text: 'Something to do',
    completed: false
  }, (err, result)=>{
    if(err){
      return console.log('nem sikerült beszúrni az adatot', err);
    }
    console.log(JSON.stringify(result.ops, undefined, 2));
  });*/

  /*db.collection('Users').insertOne({
    name: 'Chari',
    age: 30,
    location: 'Nagykanizsa'
  }, (err, result)=>{
    if(err){
      return console.log('nem sikerült beszúrni az adatot', err);
    }
    console.log(JSON.stringify(result.ops, undefined, 2));
    console.log(result.ops[0]._id.getTimestamp()); //amikor készült az id
  });*/

  db.close();
});
