import crypto from 'crypto';

import {
  appendToTable,
  filterFileRows,
  findInFile,
  getNextId,
} from '../utilities';

interface SessionTokenProperties {
  id: number;
  userId: number;
  expirationDate: number;
  token: string;
}

const SEVEN_DAYS = 1000 * 60 * 60 * 24 * 7;

const parseTableRow = (line: string) => {
  const [stringId, stringUserId, stringExpirationDate, token] = line.split(',');
  const id = Number(stringId);
  const userId = Number(stringUserId);
  const expirationDate = Number(stringExpirationDate);
  return new SessionToken({ id, userId, expirationDate, token });
};

const findTokenBy = (
  callback: (user: SessionToken) => boolean
): Promise<SessionToken | null> =>
  findInFile(
    'sessionTokens',
    'id,userId,expirationDate,token',
    callback,
    parseTableRow
  );

class SessionToken {
  id: number;
  userId: number;
  expirationDate: number;
  token: string;

  static findByToken(token: string): Promise<SessionToken | null> {
    return findTokenBy((sessionToken) => sessionToken.token === token);
  }

  static generateSessionToken(userId: number): Promise<SessionToken> {
    return getNextId('sessionTokens')
      .then((id) => {
        const token = crypto.randomBytes(16).toString('base64');
        const expirationDate = Date.now() + SEVEN_DAYS;
        const sessionToken = new SessionToken({
          id,
          userId,
          expirationDate,
          token,
        });

        return sessionToken;
      })
      .then((sessionToken) => {
        const stringToWrite = `\n${sessionToken.id},${sessionToken.userId},${sessionToken.expirationDate},${sessionToken.token}`;
        return appendToTable('sessionTokens', stringToWrite).then(
          () => sessionToken
        );
      });
  }

  static remove(token: string): Promise<void> {
    return filterFileRows(
      'sessionTokens',
      'id,userId,expirationDate,token',
      (sessionToken: SessionToken) => sessionToken.token !== token,
      parseTableRow
    );
  }

  static removeAllExpired(): Promise<void> {
    return filterFileRows(
      'sessionTokens',
      'id,userId,expirationDate,token',
      (sessionToken: SessionToken) => sessionToken.isValid(),
      parseTableRow
    );
  }

  constructor({ id, userId, expirationDate, token }: SessionTokenProperties) {
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

export default SessionToken;
