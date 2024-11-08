////////
import express from 'express';
import cors from 'cors';

import mongoose from 'mongoose';

import { registerValidation, loginValidation, taskCreateValidation, 
  categoryCreateValidation, goalCreateValidation, projectCreateValidation } from './validations.js';

import { handleValidationErrors, checkAuth } from './middlewares/index.js';

import { UserController, TaskController, ProjectController, CategoryController, 
  GoalController, TeamTaskController} from './controllers/index.js';

mongoose
  .connect('mongodb+srv://spoodyakk:wwwwww@cluster0.cssesbu.mongodb.net/app?retryWrites=true&w=majority&appName=Cluster0t/')
  .then(() => console.log('DB ok'))
  .catch((err) => console.log('DB error', err));

const app = express();

app.use(express.json());
app.use(cors());

app.post('/auth/login', loginValidation, handleValidationErrors,  UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);
app.get('/auth', checkAuth, UserController.getAll);
app.patch('/auth', checkAuth, UserController.update);

app.get('/user/:id/friends', checkAuth, UserController.getFriends);
app.post('/user/:id/friends', checkAuth, UserController.addFriend);
app.delete('/user/:id/friends', checkAuth, UserController.deleteFriend);

app.get('/tasks', checkAuth, TaskController.getAll);
app.get('/tasks/:id', TaskController.getOne);
app.post('/tasks', checkAuth, taskCreateValidation, handleValidationErrors, TaskController.create);
app.delete('/tasks/:id', checkAuth, TaskController.remove);
app.patch(
  '/tasks/:id',
  checkAuth,
  TaskController.update,
);

app.get('/teamtasks', checkAuth, TeamTaskController.getAll);
app.get('/teamtasks/:id', TeamTaskController.getOne);
app.post('/teamtasks', checkAuth, taskCreateValidation, handleValidationErrors, TeamTaskController.create);
app.delete('/teamtasks/:id', checkAuth, TeamTaskController.remove);
app.patch(
  '/teamtasks/:id',
  checkAuth,
  taskCreateValidation,
  handleValidationErrors,
  TeamTaskController.update,
);

app.get('/categories', CategoryController.getAll);
app.get('/categories/:id', CategoryController.getOne);
app.post('/categories', checkAuth, categoryCreateValidation, handleValidationErrors, CategoryController.create);
app.delete('/categories/:id', checkAuth, CategoryController.remove);
app.patch(
  '/categories/:id', 
  checkAuth, 
  categoryCreateValidation,
  handleValidationErrors,
  CategoryController.update);

app.get('/goals', checkAuth, GoalController.get);
app.post('/goals', checkAuth, goalCreateValidation, handleValidationErrors, GoalController.create);
app.delete('/goals', checkAuth, GoalController.remove);
app.patch(
  '/goals', 
  checkAuth, 
  GoalController.update);

app.get('/projects', checkAuth, ProjectController.getAll);
app.get('/projects/:id',checkAuth, ProjectController.getOne);
app.post('/projects', checkAuth, projectCreateValidation, handleValidationErrors,ProjectController.create);
app.delete('/projects/:id', checkAuth, ProjectController.remove);
app.patch(
  '/projects/:id', 
  checkAuth, 
  projectCreateValidation,
  handleValidationErrors,
  ProjectController.update);

//statistics, 


app.listen(process.env.PORT || 5000, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('Server OK');
});