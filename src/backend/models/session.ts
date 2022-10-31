import crypto from 'crypto';

import {
  addSession,
  removeExpiredSessions,
  removeSessionByToken,
} from '../clients/inMemoryDB/sessions';

import { generateId } from '../utilities';

interface SessionProperties {
  id: string;
  userId: string;
  expirationDate: number;
  token: string;
}

const SEVEN_DAYS_IN_MILLISECONDS = 1000 * 60 * 60 * 24 * 7;

class Session {
  id: string;
  userId: string;
  expirationDate: number;
  token: string;

  constructor({ id, userId, expirationDate, token }: SessionProperties) {
    this.id = id;
    this.userId = userId;
    this.expirationDate = expirationDate;
    this.token = token;
  }

  isValid(): boolean {
    const now = Date.now();

    return this.expirationDate > now;
  }
}

export const create = (userId: string): Promise<Session> => {
  const id = generateId();
  const token = crypto.randomBytes(16).toString('base64');
  const expirationDate = Date.now() + SEVEN_DAYS_IN_MILLISECONDS;
  const session = new Session({
    id,
    userId,
    expirationDate,
    token,
  });

  return addSession(session).then(() => session);
};

export const removeAllExpired = (): Promise<void> => removeExpiredSessions();

export const removeByToken = (token: string): Promise<void> =>
  removeSessionByToken(token);

export default Session;
