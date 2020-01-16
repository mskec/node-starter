import _ from 'lodash';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import chai from 'chai';
import chaiHttp from 'chai-http'; // eslint-disable-line import/newline-after-import
import request from 'supertest';
import config from '../../config/config';
import { signUserToken } from '../controllers/auth.controller';
import app from '../../index';
import User from '../models/user.model';
import testUtils from './testUtils';

chai.use(chaiHttp);
const { expect } = chai;
chai.config.includeStack = true;

describe('# Auth API', () => {
  before(() => testUtils.nukeDB());

  after(() => testUtils.nukeDB());

  describe('## POST /api/auth/registration', () => {
    const testUser = {
      email: 'test+automatedregistration@example.com',
      password: 'my_fake_strong_password',
    };

    it('should register a user', async () => {
      const res = await request(app)
        .post('/api/auth/registration')
        .send(testUser)
        .expect(httpStatus.CREATED);

      expect(res.body).to.have.property('id');
      expect(res.body).to.have.property('token');
      expect(res.body).to.have.property('email');
    });

    it('should have password strength validation', async () => {
      const res = await request(app)
        .post('/api/auth/registration')
        .send({
          email: 'test+automated.password@example.com',
          password: 'badpassword',
        })
        .expect(httpStatus.BAD_REQUEST);

      expect(res.body.message).to.equal('"password" must be stronger');
    });

    it('should have unique email constraint', async () => {
      const uniqueUser = {
        email: 'test+automatedunique@example.com',
        password: 'my_fake_strong_password',
      };

      await request(app) // First registration
        .post('/api/auth/registration')
        .send(uniqueUser)
        .expect(httpStatus.CREATED);

      const res = await request(app) // Second registration (same email)
        .post('/api/auth/registration')
        .send(uniqueUser)
        .expect(httpStatus.BAD_REQUEST);

      expect(res.body.message).to.equal('email must be unique');
    });

    it('should register a user and set displayName', async () => {
      const displayName = 'App tester';
      const res = await request(app)
        .post('/api/auth/registration')
        .send({
          email: 'test+automatedregistration.displayName@example.com',
          password: 'appPassword123',
          displayName,
        })
        .expect(httpStatus.CREATED);

      expect(res.body).to.have.property('id');
      expect(res.body).to.have.property('displayName');
      expect(res.body.displayName).to.equal(displayName);
    });


    it('should have validation for required user field', async () => {
      const res = await request(app)
        .post('/api/auth/registration')
        .send()
        .expect(httpStatus.BAD_REQUEST);

      expect(res.body.message).to.equal(
        '"email" is required and "password" is required',
      );
    });

    it('should transform email to a lower case', async () => {
      const weirdCaseEmail = 'TeSt+WeirdCaseEmaAiL@example.com';
      await request(app)
        .post('/api/auth/registration')
        .send({
          ...testUser,
          email: weirdCaseEmail,
        })
        .expect(httpStatus.CREATED);

      const user = await User.findOne({ where: { email: weirdCaseEmail.toLowerCase() } });
      expect(user.email).to.equal(weirdCaseEmail.toLocaleLowerCase());
    });
  });

  describe('## POST /api/auth/login', () => {
    let savedUser;
    const testUser = {
      email: 'test+automatedlogin@example.com',
      password: 'my_fake_strong_password',
    };

    const invalidUserCredentials = {
      email: 'test+developerXYZ@example.com',
      password: 'IDontKnow',
    };

    before(async () => {
      savedUser = await User.create(testUser);
    });

    it('should require email and password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send()
        .expect(httpStatus.BAD_REQUEST);

      expect(res.body.message).to.equal('"email" is required and "password" is required');
    });

    it('should return Authentication error for wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'this_is_invalid_pw',
        })
        .expect(httpStatus.UNAUTHORIZED);

      expect(res.body.message).to.equal('Unauthorized');
    });

    it('should return Authentication error for non-existent user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send(invalidUserCredentials)
        .expect(httpStatus.UNAUTHORIZED);

      expect(res.body.message).to.equal('Unauthorized');
    });

    async function validateSuccessfulLogIn({ email, password }) {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email, password })
        .expect(httpStatus.OK);

      expect(res.body).to.have.property('token');

      jwt.verify(res.body.token, config.jwtPublicKey, { algorithms: ['RS512'] }, (err, decoded) => {
        // @ts-ignore
        expect(decoded.user_id).to.equal(savedUser.id);
      });
    }

    it('should get valid JWT token', async () => validateSuccessfulLogIn(_.pick(testUser, ['email', 'password'])));

    it('should transform email to lowercase and login user', async () => validateSuccessfulLogIn({
      email: testUser.email.split('').map((c, idx) => (idx % 2 === 0 ? c : c.toUpperCase())).join(''),
      password: testUser.password,
    }));
  });

  describe('## POST /api/auth/token-refresh', () => {
    let savedUser;
    let expiredToken;

    before(async () => {
      savedUser = await User.create({ email: 'test+automatedtoken@example.com', password: 'my_fake_strong_password' });
      expiredToken = signUserToken(savedUser, { expiresIn: '0' });
    });

    it('should refresh expired token', async () => {
      await request(app)
        .get('/api/user')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(httpStatus.UNAUTHORIZED); // Verify that the token is expired

      const res = await request(app)
        .post('/api/auth/token-refresh')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(httpStatus.OK);

      jwt.verify(res.body.token, config.jwtPublicKey, { algorithms: ['RS512'] }, (err, decoded) => {
        // @ts-ignore
        expect(decoded.user_id).to.equal(savedUser.id);
      });
    });
  });
});
