var express=require('express');
var bodyParser=require('body-parser');
const {ObjectID}=require('mongodb');

var {mongoose}=require('./db/mongoose');
var {Todo}=require('./models/todo');
var {User}=require('./models/user');

var app=express();
app.use(bodyParser.json());

app.post('/todos', (req, res)=>{
  console.log(req.body);
  var todo = new Todo({
    text: req.body.text
  });
  todo.save().then((doc)=>{
    res.send(doc);
  }, (e)=>{
    res.status(400).send(e);
  });
});

app.get('/todos', (req, res)=>{
  Todo.find().then((todos)=>{
    res.send({todos});
  }, (e)=>{
    res.status(400).send(e);
  });
});

app.get('/todos/:id', (req, res)=>{
  var id=req.params.id;

  if(!ObjectID.isValid(id)){
    console.log('ID not valid');
    return res.status(404).send({uzi: 'Hibás id!'});
  }
  Todo.findById(id).then((todo)=>{
    if(!todo){
      return res.status(400).send({uzi: 'Nincs adat'});
    }
    res.send({uzi: 'ok', todo});
  }).catch((e)=>{
    return res.status(404).send({uzi: 'Hiba történt a lekérdezésben'});
  });

});

app.listen(3000, ()=>{
  console.log('Server started');
});

/*var newUser=new User({email: 'emailcím'});
newUser.save().then((doc)=>{
  console.log('Elmentve', doc);
}, (e)=>{
  console.log('Nem sikerült menteni', e);
});*/
/*var newTodo=new Todo({
  text: 'Cook dinner'
});

newTodo.save().then((doc)=>{
  console.log('Elmentve', doc);
}, (e)=>{
  console.log('Nem sikerült menteni');
});*/
module.exports={app};
