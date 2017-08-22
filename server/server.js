require('./config/config');


const _=require('lodash');
const express=require('express');
const bodyParser=require('body-parser');
const {ObjectID}=require('mongodb');

var {mongoose}=require('./db/mongoose');
var {Todo}=require('./models/todo');
var {User}=require('./models/user');
var {authenticate}=require('./middleware/authenticate');

var app=express();
app.use(bodyParser.json());
const port=process.env.PORT;
app.post('/todos', authenticate, (req, res)=>{
  //console.log(req.body);
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });
  todo.save().then((doc)=>{
    res.send(doc);
  }, (e)=>{
    res.status(400).send(e);
  });
});

app.get('/todos', authenticate, (req, res)=>{
  Todo.find({_creator: req.user._id}).then((todos)=>{
    res.send({todos});
  }, (e)=>{
    res.status(400).send(e);
  });
});

app.get('/todos/:id', authenticate, (req, res)=>{
  var id=req.params.id;

  if(!ObjectID.isValid(id)){
    //console.log('ID not valid');
    return res.status(404).send({uzi: 'Hibás id!'});
  }
  Todo.findOne({_id:id, _creator:req.user._id}).then((todo)=>{
    if(!todo){
      return res.status(404).send({uzi: 'Nincs adat'});
    }
    res.send({uzi: 'ok', todo});
  }).catch((e)=>{
    return res.status(404).send({uzi: 'Hiba történt a lekérdezésben'});
  });

});

app.delete('/todos/:id', authenticate, (req, res)=>{
  var id=req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send({uzi: 'Hibás id!'});
  }
  Todo.findOneAndRemove({_id:id, _creator:req.user._id}).then((todo)=>{
    if(!todo){
      return res.status(404).send({uzi: 'Nincs adat'});
    }
    res.send({uzi: 'ok', todo});
  }).catch((e)=>{
    return res.status(404).send({uzi: 'Hiba történt a lekérdezésben'});
  });
});

app.patch('/todos/:id', authenticate, (req, res)=>{
  var id=req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send({uzi: 'Hibás id!'});
  }
  var body =_.pick(req.body, ['text', 'completed']);

  if(_.isBoolean(body.completed) && body.completed){
    body.completedAt=new Date().getTime();
  }
  else{
    body.completed=false;
    body.completedAt=null;
  }

  Todo.findOneAndUpdate({_id:id, _creator:req.user._id}, {$set: body}, {new: true}).then((todo)=>{
    if(!todo){
      return res.status(404).send({uzi: 'Nincs adat'});
    }
    res.send({uzi: 'ok', todo});
  }).catch((e)=>{
    res.status(404).send();
  });

});

app.post('/users', (req, res)=>{
  var userbody = _.pick(req.body, ['email', 'password']);
  var user = new User(userbody);



  user.save().then(()=>{
    return user.generateAuthToken();
  }).then((token)=>{
    res.header('x-auth', token).send(user);
  }).catch((e)=>{
    res.status(404).send(e);
  });


});

app.post('/users/login', (req, res)=>{
  var userbody = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(userbody.email, userbody.password).then((user)=>{
    return user.generateAuthToken().then((token)=>{
      res.header('x-auth', token).send(user);
    });

  }).catch((e)=>{
    res.status(400).send();
  });
});

app.delete('/users/me/token', authenticate, (req, res)=>{
  req.user.removeToken(req.token).then(()=>{
    res.status(200).send();
  }, ()=>{
    res.status(400).send();
  });
});

app.get('/users/me', authenticate, (req, res)=>{
  res.send(req.user);
});

app.listen(port, ()=>{
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
