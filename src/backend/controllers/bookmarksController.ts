import type { RequestHandler } from 'express';

import Bookmark from '../models/bookmark';
import { ensureAuthenticated } from './utilities';

export const getBookmarks: RequestHandler = (req, res) => {
  ensureAuthenticated(req, res, () => {
    const { currentUser } = req;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    Bookmark.getAll(currentUser!.id).then((bookmarks) => {
      res.json(bookmarks);
    });
  });
};
