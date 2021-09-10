import type { User } from '../../types';

const is4xxError = (status: number) => status >= 400 && status <= 499;

export const createSession = (email: string, password: string): Promise<User> =>
  fetch('/api/v1/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
    }),
  })
    .then((res) => {
      const { status } = res;
      if (res.ok || is4xxError(status)) {
        return res.json();
      } else {
        throw new Error('Unexpected error');
      }
    })
    .then((json) => {
      if (json.error) {
        throw new Error(json.error);
      }
      return json;
    });

export const destroySession = (): Promise<void> =>
  fetch('/api/v1/session', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  }).then((res) => {
    if (is4xxError(res.status)) {
      return res.json().then((json) => {
        throw new Error(json.error);
      });
    } else if (res.ok) {
      return;
    } else {
      throw new Error('Unexpected error');
    }
  });
