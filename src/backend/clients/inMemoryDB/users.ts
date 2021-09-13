import inMemoryDB from './storage';

import type User from '../../models/user';

export const addUser = (user: User): Promise<void> =>
  new Promise((resolve, reject) => {
    const { users } = inMemoryDB;

    const isValidUser = !users.some(
      ({ id, email }) => id === user.id || email === user.email
    );

    if (!isValidUser) {
      reject('Expected ID and email to be unique, but they were not.');
    } else {
      inMemoryDB.users.push(user);

      resolve();
    }
  });

export const findUserBySessionToken = (
  sessionToken: string
): Promise<User | null> =>
  new Promise((resolve) => {
    const { sessions } = inMemoryDB;

    const session = sessions.find((session) => session.token === sessionToken);

    if (!session || !session.isValid()) {
      resolve(null);
    } else {
      const { users } = inMemoryDB;

      const user = users.find((user) => user.id === session.userId);

      if (user) {
        resolve(user);
      } else {
        resolve(null);
      }
    }
  });

export const findUserByEmail = (email: string): Promise<User | null> =>
  new Promise((resolve) => {
    const { users } = inMemoryDB;

    const user = users.find((user) => user.email === email);

    if (user) {
      resolve(user);
    } else {
      resolve(null);
    }
  });
