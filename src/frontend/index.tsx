import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';

import App from './App';

document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById('root');

  ReactDOM.render(
    <HashRouter>
      <App />
    </HashRouter>,
    rootElement
  );
});