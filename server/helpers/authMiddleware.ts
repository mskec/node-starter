import httpStatus from 'http-status';
import LRU from 'lru-cache';
import { AuthToken, Request } from '../index'; // eslint-disable-line import/no-unresolved
import jwt from './jwt';
import APIError from './APIError';
import BlacklistedToken from '../models/blacklistedToken.model';

const jtiCache = new LRU({
  max: 500,
  length: (n, key) => n.length + key.length,
  maxAge: 1000 * 60 * 15, // 15 mins
});

interface VerifyOpts {
  isOptional?: boolean
  ignoreExpiration?: boolean
}

const DEFAULT_VERIFY_OPTS: VerifyOpts = {
  isOptional: false,
};

export default (verifyOpts: VerifyOpts = DEFAULT_VERIFY_OPTS) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  (req: Request, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
      if (verifyOpts.isOptional) {
        next();
        return;
      }
      throw new APIError({ status: httpStatus.UNAUTHORIZED, isPublic: true });
    }

    try {
      req.user = jwt.verify(token, verifyOpts) as AuthToken; // eslint-disable-line no-param-reassign

      // Check if the token (jti) is blacklisted
      // First in cache
      const fromCache = jtiCache.get(req.user.jti);
      if (fromCache === 'invalid') {
        throw new APIError({ status: httpStatus.UNAUTHORIZED, isPublic: true });
      } else if (fromCache === 'valid') {
        next();
      } else {
        // Then hit the database
        BlacklistedToken.count({ where: { jti: req.user.jti } })
          .then(blacklisted => {
            if (blacklisted > 0) {
              jtiCache.set(req.user.jti, 'invalid');
              throw new APIError({ status: httpStatus.UNAUTHORIZED, isPublic: true });
            } else {
              jtiCache.set(req.user.jti, 'valid');
              next();
            }
          })
          .catch(e => next(e));
      }
    } catch (e) {
      throw new APIError({ status: httpStatus.UNAUTHORIZED, isPublic: true });
    }
  };
