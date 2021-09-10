import { ulid } from 'ulid';

import type Session from '../models/session';
import type User from '../models/user';

interface InMemoryDB {
  sessions: Session[];
  users: User[];
}

const inMemoryDB: InMemoryDB = {
  sessions: [],
  users: [],
};

export const addSessionToDB = (session: Session): Promise<void> =>
  new Promise((resolve, reject) => {
    const { sessions } = inMemoryDB;

    const isValidSession = !sessions.some(
      ({ id, token }) => id === session.id || token === session.token
    );

    if (!isValidSession) {
      reject('Expected ID and token to be unique, but they were not.');
    } else {
      inMemoryDB.sessions = [...sessions, session];

      resolve();
    }
  });

export const addUserToDB = (user: User): Promise<void> =>
  new Promise((resolve, reject) => {
    const { users } = inMemoryDB;

    const isValidUser = !users.some(
      ({ id, email }) => id === user.id || email === user.email
    );

    if (!isValidUser) {
      reject('Expected ID and email to be unique, but they were not.');
    } else {
      inMemoryDB.users = [...users, user];

      resolve();
    }
  });

export const removeExpiredSessionsFromDB = (): Promise<void> =>
  new Promise((resolve) => {
    const { sessions } = inMemoryDB;

    inMemoryDB.sessions = sessions.filter(
      (session) => session.expirationDate > Date.now()
    );

    resolve();
  });

export const removeSessionByToken = (token: string): Promise<void> =>
  new Promise((resolve) => {
    const { sessions } = inMemoryDB;

    inMemoryDB.sessions = sessions.filter((session) => session.token !== token);

    resolve();
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

export const generateId = (): string => ulid();
