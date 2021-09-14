import { Router } from 'express';

import * as FoldersController from '../../../../controllers/foldersController';

const FoldersRouter = Router();

FoldersRouter.get('/', FoldersController.getFolders);

FoldersRouter.get('/:folderId', FoldersController.getFolderById);

export default FoldersRouter;
