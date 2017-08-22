const expect=require('expect');
const request=require('supertest');
const {ObjectID}=require('mongodb');

const {app}=require('./../server');
const {Todo}=require('./../models/todo');
const {User}=require('./../models/user');
const {todos, populateTodos, users, populateUsers}=require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

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

describe('GET /users/me', ()=>{
  it('should return user if authenticated', (done)=>{
    request(app)
    .get('/users/me')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res)=>{
      expect(res.body._id).toBe(users[0]._id.toHexString());
      expect(res.body.email).toBe(users[0].email);
    })
    .end(done);
  });
  it('should return a 401 if not authenticated', (done)=>{
    request(app)
    .get('/users/me')
    .expect(401)
    .expect((res)=>{
      expect(res.body).toEqual({});
    })
    .end(done);
  });
});

describe('POST /users', ()=>{
  it('should create a user', (done)=>{
    var email='example@example.com';
    var password='123mnb!';
    request(app)
    .post('/users')
    .send({email, password})
    .expect(200)
    .expect((res)=>{
      expect(res.header['x-auth']).toExist();
      expect(res.body._id).toExist();
      expect(res.body.email).toBe(email);
    })
    .end((err)=>{
        if(err){
          return done(err);
        }

        User.findOne({email}).then((user)=>{
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        });
    });
  });
  it('should return validation errors if request is invalid', (done)=>{
    var email='example';
    var password='123';
    request(app)
    .post('/users')
    .send({email, password})
    .expect(404)
    .end(done);
  });
  it('should not create user if email in use', (done)=>{
    var email=users[0].email;
    var password='123mnb!';
    request(app)
    .post('/users')
    .send({email, password})
    .expect(404)
    .end(done);
  });
});
