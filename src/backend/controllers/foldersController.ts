import type { RequestHandler } from 'express';

import Bookmark from '../models/bookmark';
import Directory from '../models/directory';
import { ensureAuthenticated } from './utilities';
import {
  addBookmark,
  findBookmarkById,
  removeBookmark as removeBookmarkFromDB,
} from '../clients/inMemoryDB/bookmarks';

export const getFolders: RequestHandler = (req, res) => {
  ensureAuthenticated(req, res, () => {
    Directory.getAll().then((directories) => {
      res.json(directories.map((directory) => directory.toShallowJSON()));
    });
  });
};

export const getFolderById: RequestHandler = (req, res) => {
  ensureAuthenticated(req, res, () => {
    const { folderId } = req.params;
    Directory.getByIdWithBreadcrumbs(folderId).then((response) => {
      if (response === null) {
        res.status(404).json({
          error: `Unable to find a directory with an id of: ${folderId}`,
        });
      } else {
        const { breadcrumbs, directory } = response;

        res.json({
          breadcrumbs,
          directory: {
            ...directory,
            items: directory.items.map((item) =>
              item.type === 'file' ? item : item.toShallowJSON()
            ),
          },
        });
      }
    });
  });
};

export const bookmark: RequestHandler = (req, res) => {
  ensureAuthenticated(req, res, () => {
    const { currentUser } = req;
    const { folderId } = req.params;

    const bookmark = Bookmark.generate({
      directoryId: folderId,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      userId: currentUser!.id,
    });

    addBookmark(bookmark).then(() => {
      res.json(bookmark);
    });
  });
};

export const removeBookmark: RequestHandler = (req, res) => {
  ensureAuthenticated(req, res, () => {
    const { currentUser } = req;
    const { folderId } = req.params;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    findBookmarkById(currentUser!.id, folderId).then((bookmark) => {
      if (!bookmark) {
        res
          .status(404)
          .json({ error: `Unable to find a bookmark for folder ${folderId}.` });
      } else {
        removeBookmarkFromDB(bookmark.id).then(() => {
          res.json({ message: 'OK' });
        });
      }
    });
  });
};
