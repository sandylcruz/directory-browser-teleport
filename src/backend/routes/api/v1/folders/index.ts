import { Router } from 'express';

import * as FoldersController from '../../../../controllers/foldersController';

const FoldersRouter = Router();

FoldersRouter.get('/*', FoldersController.getFolderByPath);

export default FoldersRouter;
