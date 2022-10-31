import crypto from 'crypto';

import { generateId } from '../utilities';
import * as inMemoryDB from '../clients/inMemoryDB/users';

import type { User as PublicUser } from '../../types';

interface AllUserProperties {
  email: string;
  id: string;
  passwordDigest: string;
}

class User {
  email: string;
  id: string;
  passwordDigest: string;

  constructor({ email, id, passwordDigest }: AllUserProperties) {
    this.email = email;
    this.id = id;
    this.passwordDigest = passwordDigest;
  }

  verifyPassword(password: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const [salt, key] = this.passwordDigest.split(':');
      crypto.scrypt(password, salt, 64, (err, derivedKey) => {
        if (err) reject(err);
        resolve(key === derivedKey.toString('hex'));
      });
    });
  }

  toJSON(): Omit<AllUserProperties, 'passwordDigest'> {
    return {
      id: this.id,
      email: this.email,
    };
  }
}

export const findUserBySessionToken = (
  token: string
): Promise<PublicUser | null> => inMemoryDB.findUserBySessionToken(token);

export const findUserByEmail = (email: string): Promise<User | null> =>
  inMemoryDB.findUserByEmail(email);

export const findUserByCredentials = (
  email: string,
  password: string
): Promise<User | null> =>
  inMemoryDB.findUserByEmail(email).then((user) => {
    if (!user) return null;

    return user
      .verifyPassword(password)
      .then((isValid) => (isValid ? user : null));
  });

export const generatePasswordDigest = (password: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');

    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);

      resolve(salt + ':' + derivedKey.toString('hex'));
    });
  });

export const generate = (email: string, password: string): Promise<User> =>
  generatePasswordDigest(password).then((passwordDigest) => {
    const id = generateId();
    return new User({ id, email, passwordDigest });
  });

export default User;
