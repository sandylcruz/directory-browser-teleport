import crypto from 'crypto';

import { findInFile } from '../utilities';
import type { User as PublicUser } from '../../types';

interface AllUserProperties {
  email: string;
  id: number;
  passwordDigest: string;
}

const findUserBy = (callback: (user: User) => boolean): Promise<User | null> =>
  findInFile('users', 'id,email,passwordDigest', callback, (line) => {
    const [stringId, email, passwordDigest] = line.split(',');
    const id = Number(stringId);
    return new User({ id, email, passwordDigest });
  });

class User {
  email: string;
  id: number;
  passwordDigest: string;

  static findUserById(id: number): Promise<PublicUser | null> {
    return findUserBy((user) => user.id === id).then((user) => {
      if (!user) {
        return null;
      }

      return user.toJSON();
    });
  }

  static findUserByEmail(email: string): Promise<User | null> {
    return findUserBy((user) => user.email === email);
  }

  static generatePasswordDigest(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const salt = crypto.randomBytes(16).toString('hex');

      crypto.scrypt(password, salt, 64, (err, derivedKey) => {
        if (err) reject(err);

        resolve(salt + ':' + derivedKey.toString('hex'));
      });
    });
  }

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

export default User;
