import * as React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';

import App from '../App';

const server = setupServer(
  rest.post('/api/v1/session', (req, res, ctx) =>
    res(ctx.json({ id: 1, email: 'test@gmail.com' }))
  ),
  rest.get('/api/v1/bookmarks', (req, res, ctx) => res(ctx.json([]))),
  rest.get('/api/v1/folders', (req, res, ctx) => res(ctx.json([])))
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('login', () => {
  it('redirects to /folder on successful login', async () => {
    const history = createMemoryHistory();
    history.push('/login');

    render(
      <Router history={history}>
        <App />
      </Router>
    );

    const emailInput = screen.getByLabelText('Email') as HTMLInputElement;

    fireEvent.change(emailInput, {
      target: { value: 'test@gmail.com' },
    });

    expect(emailInput.value).toBe('test@gmail.com');

    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;

    fireEvent.change(passwordInput, {
      target: { value: '123456' },
    });

    expect(passwordInput.value).toBe('123456');

    const submitButton = screen.getByText('Submit');

    fireEvent.click(submitButton);

    await waitFor(() => screen.getByText('↑Name'));
  });

  it('does not redirect to /folder on unsuccessful login', async () => {
    server.use(
      rest.post('/api/v1/session', (req, res, ctx) =>
        res(
          ctx.status(401),
          ctx.json({
            error: 'Invalid credentials',
          })
        )
      )
    );
    const history = createMemoryHistory();
    history.push('/login');

    render(
      <Router history={history}>
        <App />
      </Router>
    );

    const emailInput = screen.getByLabelText('Email') as HTMLInputElement;

    fireEvent.change(emailInput, {
      target: { value: 'test@gmail.com' },
    });

    expect(emailInput.value).toBe('test@gmail.com');

    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;

    fireEvent.change(passwordInput, {
      target: { value: '123456' },
    });

    expect(passwordInput.value).toBe('123456');

    const submitButton = screen.getByText('Submit');

    fireEvent.click(submitButton);

    await waitFor(() => screen.getByText('Invalid credentials'));
  });
});
