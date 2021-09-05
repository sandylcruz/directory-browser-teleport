import express from 'express';
import { Router } from 'express';
import APIRouter from './api';
import path from 'path';

const AppRouter = Router();
const indexHTMLPath = path.join(__dirname, '../index.html');

AppRouter.use('/assets', express.static(path.join(__dirname, '../../../dist')));

AppRouter.use('/api', APIRouter);

AppRouter.get('*', (req, res) => {
  res.set('Content-Type', 'text/html');
  res.sendFile(indexHTMLPath);
});

export default AppRouter;
