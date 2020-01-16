import jwt from 'jsonwebtoken';
import config from '../../config/config';

/**
 * @param s JWT or Authorization header (incl. JWT or Bearer prefix)
 * @param verifyOpts Options for verification
 */
function verify(s = '', verifyOpts = {}) {
  let token = s;
  const matched = s.match(/(JWT|Bearer)\s(.*)/);
  if (matched) {
    token = matched[2]; // eslint-disable-line prefer-destructuring
  }

  return jwt.verify(token, config.jwtPublicKey, verifyOpts);
}

export default { verify };
