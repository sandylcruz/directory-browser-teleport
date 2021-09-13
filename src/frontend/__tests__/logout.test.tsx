import * as React from 'react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import App from '../App';

const server = setupServer(
  rest.delete('/api/v1/session', (req, res, ctx) =>
    res(ctx.json({ message: 'OK' }))
  ),
  rest.get('/api/v1/bookmarks', (req, res, ctx) => res(ctx.json([]))),
  rest.get('/api/v1/folders', (req, res, ctx) => res(ctx.json([])))
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('logout', () => {
  it('redirects to /login on logout', async () => {
    const history = createMemoryHistory();
    history.push('/folder');

    window.currentUser = {
      id: '1',
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

  it('shows correct error if logout is unsuccessful', async () => {
    server.use(
      rest.delete('/api/v1/session', (req, res, ctx) =>
        res(
          ctx.status(422),
          ctx.json({
            error: 'Unsuccessful logout',
          })
        )
      )
    );
    const history = createMemoryHistory();
    history.push('/folder');

    window.currentUser = {
      id: '1',
      email: 'test@gmail.com',
    };

    render(
      <Router history={history}>
        <App />
      </Router>
    );

    const logoutButton = screen.getByText('Log Out');

    fireEvent.click(logoutButton);

    await waitFor(() => screen.getByText('Unsuccessful logout'));
  });
});
