import type { RequestHandler } from 'express';

import * as Directory from '../models/directory';
import { ensureAuthenticated } from './utilities';

export const getFolderByPath: RequestHandler = (req, res) => {
  ensureAuthenticated(req, res, () => {
    Directory.getByPath(req.path).then((directory) => {
      if (directory === null) {
        res.status(404).json({
          error: `Unable to find a directory with an path of: ${req.path}`,
        });
      } else {
        res.json({
          ...directory,
          items: directory.items.map((item) =>
            item.type === 'file' ? item : item.toShallowJSON()
          ),
        });
      }
    });
  });
};
