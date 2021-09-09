import * as React from 'react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import App from '../App';

const server = setupServer(
  rest.delete('/api/v1/login', (req, res) => {
    return res();
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('logout', () => {
  it('redirects to /login on logout', async () => {
    const history = createMemoryHistory();
    history.push('/folder');

    window.currentUser = {
      id: 1,
      email: 'test@gmail.com',
    };

    render(
      <Router history={history}>
        <App />
      </Router>
    );

    const logoutButton = screen.getByText('Log Out');

    fireEvent.click(logoutButton);

    await waitFor(() => screen.getByText('Sign In'));
  });
});
