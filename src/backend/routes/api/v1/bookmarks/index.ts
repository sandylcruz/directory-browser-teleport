import { Router } from 'express';

import * as BookmarksController from '../../../../controllers/bookmarksController';

const BookmarkRouter = Router();

BookmarkRouter.get('/', BookmarksController.getBookmarks);

export default BookmarkRouter;
