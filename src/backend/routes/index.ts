import express from 'express';
import { Router } from 'express';
import path from 'path';

import APIRouter from './api';

const AppRouter = Router();

AppRouter.use('/assets', express.static(path.join(__dirname, '../../../dist')));

AppRouter.use('/api', APIRouter);

AppRouter.get('*', (req, res) => {
  const { currentUser } = req;

  res.set('Content-Type', 'text/html');

  res.send(`
<!DOCTYPE html>
<html>
  <head>
    <script type="text/javascript" src="/assets/bundle.js"></script>

    ${
      currentUser
        ? `<script type="text/javascript" id="currentUserPreload">window.currentUser = ${JSON.stringify(
            currentUser
          )};</script>`
        : ''
    }
  </head>

  <body>
    <div id="root">Loading...</div>

    <script
      type="text/javascript"
      src="http://localhost:35729/livereload.js?snipver=1"
    ></script>
  </body>
</html>
  `);
});

export default AppRouter;
