const expect=require('expect');
const request=require('supertest');
const {ObjectID}=require('mongodb');

const {app}=require('./../server');
const {Todo}=require('./../models/todo');

const todos=[{
  _id: new ObjectID(),
  text: 'First test',
  completed: true,
  completedAt: 1234
}, {_id: new ObjectID(), text: 'Second test'},
{_id: new ObjectID(), text: 'Third test'}];

beforeEach((done)=>{
  Todo.remove({}).then(()=>{
    return Todo.insertMany(todos);
    }).then(()=>done());
});

describe('POST /todos', ()=>{
  it('new todo', (done)=>{
    var text='test todo';

    request(app)
    .post('/todos')
    .send({text})
    .expect(200)
    .expect((res)=>{
      expect(res.body.text).toBe(text);
    })
    .end((err, res)=>{
      if(err){
        return done(err);
      }
      Todo.find().then((todos)=>{
        expect(todos.length).toBe(4);
        expect(todos[3].text).toBe(text);
        done();
      }).catch((e)=>done(e));
    });
  });

  it('rossz adatkuldés check', (done)=>{
    request(app)
    .post('/todos')
    .send({})
    .expect(400)
    .end((err, res)=>{
      if(err){
        return done(err);
      }
      Todo.find().then((todos)=>{
        expect(todos.length).toBe(3);
        done();
      }).catch((e)=>done(e));
    });
  });
});

describe('get /todos', ()=>{
  it('should get all todos', (done)=>{
    request(app)
    .get('/todos')
    .expect(200)
    .expect((res)=>{
      expect(res.body.todos.length).toBe(3);
    })
    .end(done);
  });
});

describe('get /todos/:id', ()=>{
  it('should return todo doc', (done)=>{
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .expect(200)
    .expect((res)=>{
      expect(res.body.todo.text).toBe(todos[0].text);
    })
    .end(done);
  });
  it('should return 404 if todo not found', (done)=>{
    var testid=new ObjectID();
    request(app)
    .get('/todos/'+testid.toHexString())
    .expect(404)
    .end(done);
  });
  it('should return 404 for non-object ids', (done)=>{
    request(app)
    .get('/todos/123')
    .expect(404)
    .end(done);
  });
});

describe('DELETE /todos/:id', ()=>{
  it('should remove a todo', (done)=>{
    var hexId=todos[1]._id.toHexString();

    request(app)
    .delete(`/todos/${hexId}`)
    .expect(200)
    .expect((res)=>{
      expect(res.body.todo._id).toBe(hexId);
    })
    .end((err, res)=>{
      if(err){
        return done(err);
      }

      Todo.findById(hexId).then((todo)=>{
        expect(todo).toNotExist();
        done();
      }).catch((e)=>done(e));
    });
  });
  it('should return 404 if todo not found', (done)=>{
    var testid=new ObjectID();
    request(app)
    .delete('/todos/'+testid.toHexString())
    .expect(404)
    .end(done);
  });
  it('should return 404 if object id is invalid', (done)=>{
    request(app)
    .delete('/todos/123')
    .expect(404)
    .end(done);

  });
});

describe('patch todos/:id', ()=>{
  it('should update the todo', (done)=>{
    var hexId=todos[1]._id.toHexString();
    var newtodo={text: 'új szöveg', completed:true};
    request(app)
    .patch('/todos/'+hexId)
    .send(newtodo)
    .expect(200)
    .expect((res)=>{
      expect(res.body.todo.text).toBe(newtodo.text);
      expect(res.body.todo.completed).toBe(true);
      expect(res.body.todo.completedAt).toBeA('number');
    })
    .end(done);
  });
  it('should clear completed at when todo is not completed', (done)=>{
    var hexId=todos[0]._id.toHexString();
    var newtodo={text: 'új szöveg 2', completed:false};
    request(app)
    .patch('/todos/'+hexId)
    .send(newtodo)
    .expect(200)
    .expect((res)=>{
      expect(res.body.todo.text).toBe(newtodo.text);
      expect(res.body.todo.completed).toBe(false);
      expect(res.body.todo.completedAt).toNotExist();
    })
    .end(done);
  });
});
