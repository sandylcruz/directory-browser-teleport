import crypto from 'crypto';

import {
  addSessionToDB,
  generateId,
  removeExpiredSessionsFromDB,
  removeSessionByToken,
} from '../utilities';

interface SessionProperties {
  id: string;
  userId: string;
  expirationDate: number;
  token: string;
}

const SEVEN_DAYS = 1000 * 60 * 60 * 24 * 7;

class Session {
  id: string;
  userId: string;
  expirationDate: number;
  token: string;

  static generateSessionToken(userId: string): Promise<Session> {
    const id = generateId();
    const token = crypto.randomBytes(16).toString('base64');
    const expirationDate = Date.now() + SEVEN_DAYS;
    const session = new Session({
      id,
      userId,
      expirationDate,
      token,
    });

    return addSessionToDB(session).then(() => session);
  }

  static removeAllExpired(): Promise<void> {
    return removeExpiredSessionsFromDB();
  }

  static removeByToken(token: string): Promise<void> {
    return removeSessionByToken(token);
  }

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

export default Session;
