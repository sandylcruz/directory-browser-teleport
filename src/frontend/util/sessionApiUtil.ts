import type { User } from '../../types';

export const postLogin = (email: string, password: string): Promise<User> =>
  fetch('/api/v1/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
    }),
  }).then((res) => {
    if (res.ok) {
      return res.json();
    } else if (res.status === 401) {
      throw new Error('Invalid credentials');
    } else {
      throw new Error('Unexpected error');
    }
  });

export const postLogout = (): Promise<void> =>
  fetch('/api/v1/login', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  }).then((res) => {
    if (!res.ok) {
      throw new Error('Logout unsuccessful');
    }
  });
