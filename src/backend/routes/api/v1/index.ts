import { Router } from 'express';

import * as AuthenticationController from '../../../controllers/authenticationController';
import * as FoldersController from '../../../controllers/foldersController';

const V1Router = Router();

V1Router.get('/folders', FoldersController.getFolders);

V1Router.post('/session', AuthenticationController.login);
V1Router.delete('/session', AuthenticationController.logout);

export default V1Router;
