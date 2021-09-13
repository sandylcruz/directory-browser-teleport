import { Router } from 'express';

import * as FoldersController from '../../../../controllers/foldersController';

const FoldersRouter = Router();

FoldersRouter.get('/', FoldersController.getFolders);

FoldersRouter.get('/:folderId', FoldersController.getFolderById);

FoldersRouter.post('/:folderId/bookmark', FoldersController.bookmark);

FoldersRouter.delete('/:folderId/bookmark', FoldersController.removeBookmark);

export default FoldersRouter;
