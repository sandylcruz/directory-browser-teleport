import type { RequestHandler } from 'express';

export const getFolders: RequestHandler = (req, res) => {
  res.json([]);
};
