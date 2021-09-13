import inMemoryDB from '../storage';

import type Session from '../../../models/session';

export const addSession = (session: Session): Promise<void> =>
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

export const removeExpiredSessions = (): Promise<void> =>
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
