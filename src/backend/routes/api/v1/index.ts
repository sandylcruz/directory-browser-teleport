import { Router } from 'express';

import * as AuthenticationController from '../../../controllers/authenticationController';
import * as FoldersController from '../../../controllers/foldersController';

const V1Router = Router();

V1Router.get('/folders', FoldersController.getFolders);

V1Router.post('/login', AuthenticationController.login);
V1Router.delete('/login', AuthenticationController.logout);

export default V1Router;
