/* eslint-disable import/no-extraneous-dependencies */

import request from 'supertest';
import httpStatus from 'http-status';
import _ from 'lodash';
import app from '../..';
import BlacklistedToken from '../models/blacklistedToken.model';
import User from '../models/user.model';

/**
 * An alternative nukeDB; there's an issue with FK references.
 * import database from '../database';
 * Promise.all(
 *   Object.values(database.models)
 *     .map(model => model.destroy({ truncate: true })),
 * );
 */
const nukeDB = () => Promise.all([
  BlacklistedToken.destroy({ truncate: true, cascade: true }),
  User.destroy({ truncate: true, cascade: true }),
]);

const delayVerifyRestore = mock => Promise.delay(20)
  .then(() => {
    mock.verify();
    mock.restore();
  });

async function loginUser(user) {
  const res = await request(app)
    .post('/api/auth/login')
    .send(_.pick(user, ['email', 'password']))
    .expect(httpStatus.OK);

  return res.body;
}

function shouldRequireAuth(method: 'get' | 'post' | 'patch' | 'delete' | 'head', route: string, appBuild?: number) {
  it(
    'should require authentication token',
    () => request(app)[method](route).set('app-build', appBuild || 1).expect(httpStatus.UNAUTHORIZED),
  );
}

export default {
  delayVerifyRestore,
  nukeDB,
  loginUser,
  shouldRequireAuth,
};
