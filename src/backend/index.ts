import express from 'express';

import Router from './routes';
import startLivereloadServer from './livereload';

const app = express();
const port = 3000;

app.use('/', Router);

app.listen(port, () => {
  console.log(`Server started and listening at http://localhost:${port}`);
  startLivereloadServer();
});
