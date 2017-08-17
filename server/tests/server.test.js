const expect=require('expect');
const request=require('supertest');
const {ObjectID}=require('mongodb');

const {app}=require('./../server');
const {Todo}=require('./../models/todo');

const todos=[{
  _id: new ObjectID(),
  text: 'First test'
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
