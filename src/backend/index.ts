import express from 'express';
import cookieParser from 'cookie-parser';

import Router from './routes';
import startLivereloadServer from './livereload';
import { ensureDbFilesExist } from './utilities';
import { authenticationMiddleware } from './controllers/authenticationController';

const app = express();
const port = 3000;

ensureDbFilesExist();

app.use(cookieParser());

app.use(authenticationMiddleware);

app.use(express.json());

app.use('/', Router);

app.listen(port, () => {
  console.log(`Server started and listening at http://localhost:${port}`);
  startLivereloadServer();
});
