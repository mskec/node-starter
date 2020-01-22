import request from 'supertest';
import httpStatus from 'http-status';
import chai from 'chai';
import app from '../..';
import factory from './factory';
import testUtils from './testUtils';

const { expect } = chai;
chai.config.includeStack = true;

describe('# User API', () => {
  const testUser = {
    email: 'test+automated@example.com',
    password: 'my_fake_password',
  };

  let tToken;

  before(async () => {
    await testUtils.nukeDB();
    const { token } = await factory.createUserAndToken(testUser);
    tToken = token;
  });

  after(() => testUtils.nukeDB());

  describe('## GET /api/user', () => {
    testUtils.shouldRequireAuth('get', '/api/user');

    it('should get user profile', async () => {
      const res = await request(app)
        .get('/api/user')
        .set('Authorization', `Bearer ${tToken}`)
        .expect(httpStatus.OK);

      expect(res.body).to.have.property('id');
      expect(res.body).to.include({
        email: testUser.email,
      });
    });
  });

  describe('## PATCH /api/user', () => {
    it('should update user details', async () => {
      const newUserData = {
        displayName: 'app_tester',
      };

      const res = await request(app)
        .patch('/api/user')
        .set('Authorization', `Bearer ${tToken}`)
        .send(newUserData)
        .expect(httpStatus.OK);

      expect(res.body.displayName).to.equal(newUserData.displayName);
    });

    it('should require at least one field to be updated', async () => {
      const res = await request(app)
        .patch('/api/user')
        .set('Authorization', `Bearer ${tToken}`)
        .expect(httpStatus.BAD_REQUEST);

      expect(res.body.message).to.equal('Bad Request');
    });

    testUtils.shouldRequireAuth('patch', '/api/user');
  });

  describe('## POST /api/user/password', () => {
    it("should update user's password", async () => {
      const password = 'very_long_password';
      const { user, token } = await factory.createUserAndToken({ password });

      const newPassword = 'new_very_long_password';
      await request(app)
        .post('/api/user/password')
        .set('Authorization', `Bearer ${token}`)
        .send({ oldPassword: password, password: newPassword })
        .expect(httpStatus.OK);

      await testUtils.loginUser({ email: user.email, password: newPassword });
    });

    it("should not update user's password if the old one is wrong", async () => {
      const password = 'very_long_password';
      const { user, token } = await factory.createUserAndToken({ password });

      const newPassword = 'new_very_long_password';
      await request(app)
        .post('/api/user/password')
        .set('Authorization', `Bearer ${token}`)
        .send({ oldPassword: 'wrong_old_password', password: newPassword })
        .expect(httpStatus.BAD_REQUEST);

      await testUtils.loginUser({ email: user.email, password: newPassword }, httpStatus.UNAUTHORIZED);
    });

    testUtils.shouldRequireAuth('post', '/api/user/password');
  });
});
