import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import httpStatus from 'http-status';
import config from '../../config/config';
import User from '../models/user.model';
import APIError from '../helpers/APIError';

/** Register a new user */
async function registration(req, res, next) {
  try {
    const userData = _.pick(req.body, ['email', 'password', 'displayName']);
    const user = await User.create({ ...userData, email: userData.email.toLowerCase() });
    res.status(httpStatus.CREATED).json(Object.assign({ token: signUserToken(user) }, User.format(user)));
  } catch (e) {
    next(e);
  }
}

/** Login a user */
async function login(req, res, next) {
  try {
    const user = await User.findOne({ where: { email: req.body.email.toLowerCase() } });
    if (!user) {
      throw new APIError({ status: httpStatus.UNAUTHORIZED, isPublic: true });
    }

    const isValid = await bcrypt.compare(req.body.password, user.password);
    if (!isValid) {
      throw new APIError({ status: httpStatus.UNAUTHORIZED, isPublic: true });
    }

    res.json(Object.assign({ token: signUserToken(user) }, User.format(user)));
  } catch (e) {
    next(e);
  }
}

async function tokenRefresh(req, res, next) {
  try {
    const user = await User.findByPk(req.user.user_id);
    if (!user) {
      // User doesn't exist anymore
      throw new APIError({ status: httpStatus.UNAUTHORIZED, isPublic: true });
    }

    res.json(Object.assign({ token: signUserToken(user) }, User.format(user)));
  } catch (e) {
    next(e);
  }
}

/** Helper functions */
export function signUserToken(user, opts = {}) {
  return jwt.sign({
    user_id: user.id,
    role: user.role,
  }, config.jwtPrivateKey, {
    algorithm: 'RS512',
    expiresIn: config.env === 'production' ? '1d' : '7d',
    ...opts,
  });
}

export default {
  registration,
  login,
  tokenRefresh,
  signUserToken,
};
