import { Router } from 'express';

import * as AuthenticationController from '../../../controllers/authenticationController';
import BookmarkRouter from './bookmarks';
import FoldersRouter from './folders';

const V1Router = Router();

V1Router.post('/session', AuthenticationController.login);
V1Router.delete('/session', AuthenticationController.logout);

V1Router.use('/bookmarks', BookmarkRouter);
V1Router.use('/folders', FoldersRouter);

export default V1Router;
