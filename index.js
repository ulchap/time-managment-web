////////
import express from 'express';
import cors from 'cors';

import mongoose from 'mongoose';

import { registerValidation, loginValidation } from './validations.js';

import { handleValidationErrors, checkAuth } from './middlewares/index.js';

import { UserController} from './controllers/index.js';

mongoose
  .connect('mongodb+srv://spoodyakk:wwwwww@cluster0.cssesbu.mongodb.net/app?retryWrites=true&w=majority&appName=Cluster0t/')
  .then(() => console.log('DB ok'))
  .catch((err) => console.log('DB error', err));

const app = express();

app.use(express.json());
app.use(cors());

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.listen(process.env.PORT || 5000, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('Server OK');
});