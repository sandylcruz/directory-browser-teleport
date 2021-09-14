import type { RequestHandler } from 'express';

import Directory from '../models/directory';
import { ensureAuthenticated } from './utilities';

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
    Directory.getByIdWithPath(folderId).then((response) => {
      if (response === null) {
        res.status(404).json({
          error: `Unable to find a directory with an id of: ${folderId}`,
        });
      } else {
        const { path, directory } = response;

        res.json({
          path,
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
