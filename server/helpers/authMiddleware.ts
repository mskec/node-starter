import httpStatus from 'http-status';
import jwt from './jwt';
import APIError from './APIError';

interface VerifyOpts {
  isOptional?: boolean
  ignoreExpiration?: boolean
}
const DEFAULT_VERIFY_OPTS: VerifyOpts = {
  isOptional: false,
};

export default (verifyOpts: VerifyOpts = DEFAULT_VERIFY_OPTS) => (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    if (verifyOpts.isOptional) {
      next();
      return;
    }
    throw new APIError({ status: httpStatus.UNAUTHORIZED, isPublic: true });
  }

  try {
    req.user = jwt.verify(token, verifyOpts); // eslint-disable-line no-param-reassign
  } catch (e) {
    throw new APIError({ status: httpStatus.UNAUTHORIZED, isPublic: true });
  }
  next();
};
