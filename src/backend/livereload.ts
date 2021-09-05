import livereload from 'livereload';
import path from 'path';

const livereloadServer = livereload.createServer();

const startLivereloadServer = (): void => {
  if (process.env['NODE_ENV'] === 'development') {
    livereloadServer.watch(path.join(__dirname, '../../dist'));
  }
};

export default startLivereloadServer;
