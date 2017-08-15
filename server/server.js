var mongoose=require('mongoose');

mongoose.Promise=global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp', {
  useMongoClient: true
});

var Todo=mongoose.model('Todo', {
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false,

  },
  completedAt: {
    type: Number,
    default: null
  }
});

var User=mongoose.model('User', {
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  }
});

var newUser=new User({email: 'emailcím'});
newUser.save().then((doc)=>{
  console.log('Elmentve', doc);
}, (e)=>{
  console.log('Nem sikerült menteni', e);
});
/*var newTodo=new Todo({
  text: 'Cook dinner'
});

newTodo.save().then((doc)=>{
  console.log('Elmentve', doc);
}, (e)=>{
  console.log('Nem sikerült menteni');
});*/
