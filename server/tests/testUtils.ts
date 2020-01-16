/* eslint-disable import/no-extraneous-dependencies */

import request from 'supertest';
import httpStatus from 'http-status';
import _ from 'lodash';
import faker from 'faker';
import app from '../..';
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
  User.destroy({ truncate: true, cascade: true })
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

async function createUserAndLogin(userData?) {
  const dummyData = {
    password: 'very_hard_to_break_password_1947201',
    email: faker.internet.email().toLowerCase(),
  };
  const user = await User.create({ ...dummyData, ...userData });
  const { token } = await loginUser({ ...dummyData, ...userData });
  return { user, token };
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
  createUserAndLogin,
  shouldRequireAuth,
};
