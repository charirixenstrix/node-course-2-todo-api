const {ObjectID}=require('mongodb');
const jwt=require('jsonwebtoken');
const {Todo}=require('./../../models/todo');
const {User}=require('./../../models/user');

const userOneId=new ObjectID();
const userTwoId=new ObjectID();
const users=[{
  _id: userOneId,
  email: 'charirixenstrix@gmail.com',
  password: 'dragon',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
  }]
}, {
  _id: userTwoId,
  email: 'jen@example.com',
  password: 'dragon1',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userTwoId, access: 'auth'}, 'abc123').toString()
  }]
}];

const todos=[{
  _id: new ObjectID(),
  text: 'First test',
  completed: true,
  completedAt: 1234,
  _creator: userOneId
}, {_id: new ObjectID(), text: 'Second test', _creator: userTwoId},
{_id: new ObjectID(), text: 'Third test', _creator: userOneId}];

const populateTodos=(done)=>{
  Todo.remove({}).then(()=>{
    return Todo.insertMany(todos);
    }).then(()=>done());
};

const populateUsers=(done)=>{
  User.remove({}).then(()=>{
    var UserOne=new User(users[0]).save();
    var UserTwo=new User(users[1]).save();

    return Promise.all([UserOne, UserTwo]).then(()=>done());
    });


};

module.exports={todos, populateTodos, users, populateUsers};
