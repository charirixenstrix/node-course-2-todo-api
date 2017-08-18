const {ObjectID}=require('mongodb');

const {mongoose}=require('./../server/db/mongoose');
const {Todo}=require('./../server/models/todo');

/*Todo.remove({}).then((result)=>{
  console.log(result);
}); //mindent töröl*/

//Todo.findOneAndRemove({_id:'59957fd8bb7996205a157fa1'})

Todo.findByIdAndRemove('59957fd8bb7996205a157fa1').then((todo)=>{
  console.log(todo);
});
