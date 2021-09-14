import express from 'express';
import cookieParser from 'cookie-parser';

import Router from './routes';
import startLivereloadServer from './livereload';
import { authenticationMiddleware } from './controllers/authenticationController';
import User from './models/user';
import { addUser } from './clients/inMemoryDB/users';

const app = express();
const port = 3000;

app.use(cookieParser());

app.use(authenticationMiddleware);

app.use(express.json());

app.use('/', Router);

app.listen(port, () => {
  console.log(`Server started and listening at http://localhost:${port}`);
  startLivereloadServer();

  User.generate('test@gmail.com', '123456').then((user) => {
    addUser(user);
    console.log(`Successfully seeded user: ${user.email}`);
  });
});
