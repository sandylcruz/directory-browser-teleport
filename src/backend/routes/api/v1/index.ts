import { Router } from 'express';

const V1Router = Router();

V1Router.get('/folders', (req, res) => {
  res.set('Content-Type', 'application/json');
  res.json([]);
});

export default V1Router;
