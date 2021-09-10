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

export const login: RequestHandler = (req, res) => {
  const { body } = req;

  if (!isValidLoginRequestBody(body)) {
    res.status(422).json({
      error:
        'Malformed request received. Please contact us to help resolve this error.',
    });
  } else {
    User.findUserByEmail(body.email).then((user) => {
      if (user) {
        user.verifyPassword(body.password).then((isCorrectPassword) => {
          if (isCorrectPassword) {
            Session.generateSessionToken(user.id).then((sessionToken) => {
              res.cookie('sessionToken', sessionToken.token, {
                sameSite: 'strict',
                secure: true,
                httpOnly: true,
              });
              res.json(user);
            });
          } else {
            res.status(401).json({ error: 'Invalid credentials provided.' });
          }
        });
      } else {
        res.status(401).json({ error: 'Invalid credentials provided.' });
      }
    });
  }
};

export const logout: RequestHandler = (req, res) => {
  const { sessionToken } = req.cookies;

  if (!sessionToken) {
    res.sendStatus(201);
  } else {
    Session.removeByToken(sessionToken).then(() => {
      res.clearCookie('sessionToken');
      res.sendStatus(201);
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
