import type { RequestHandler } from 'express';

import Session from '../models/session';
import User from '../models/user';

export interface LoginRequestBody {
  email: string;
  password: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isValidLoginRequestBody = (body: any): body is LoginRequestBody => {
  const { email, password } = body;

  return typeof email === 'string' && typeof password === 'string';
};

export const login: RequestHandler = async (req, res) => {
  try {
    const { body } = req;

    if (!isValidLoginRequestBody(body)) {
      res.status(422).json({
        error:
          'Malformed request received. Please contact us to help resolve this error.',
      });
      return;
    }

    const user = await User.findUserByCredentials(body.email, body.password);
    if (!user) throw new Error();
    const session = await Session.create(user.id);

    res.cookie('sessionToken', session.token, {
      sameSite: 'strict',
      secure: true,
      httpOnly: true,
    });

    res.json(user);
  } catch (error) {
    // Provide a generic error to avoid leaking unnecessary information.
    res.status(401).json({ error: 'Invalid credentials provided.' });
  }
};

export const logout: RequestHandler = (req, res) => {
  const { sessionToken } = req.cookies;

  res.clearCookie('sessionToken');

  if (!sessionToken) {
    res.json({ message: 'OK' });
  } else {
    Session.removeByToken(sessionToken).then(() => {
      res.json({ message: 'OK' });
    });
  }
};

export const authenticationMiddleware: RequestHandler = (req, res, next) => {
  const { sessionToken } = req.cookies;

  if (!sessionToken) {
    next();
  } else {
    User.findUserBySessionToken(sessionToken).then((user) => {
      if (!user) {
        next();
      } else {
        req.currentUser = user;
        next();
      }
    });
  }
};
