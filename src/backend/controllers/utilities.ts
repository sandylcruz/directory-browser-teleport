import { assert } from 'console';
import type { RequestHandler } from 'express';

// NOTE: For the time being, this is handled at the controller level just for
// ease of testing. In the future, this should be handled at the route level.
export const ensureAuthenticated: RequestHandler = (req, res, next) => {
  if (!req.currentUser) {
    res
      .status(401)
      .json({ error: 'You must be logged in to make this request.' });
  } else {
    assert(req.currentUser);
    next();
  }
};
