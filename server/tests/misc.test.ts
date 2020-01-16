import request from 'supertest';
import httpStatus from 'http-status';
import chai from 'chai';
import app from '../../index';

const { expect } = chai;
chai.config.includeStack = true;

describe('# Misc', () => {
  describe('## GET /api/health-check', () => {
    it('should return OK', async () => {
      const res = await request(app)
        .get('/api/health-check')
        .expect(httpStatus.OK);

      expect(res.text).to.equal('OK');
    });
  });

  describe('## GET /api/404', () => {
    it('should return 404 status', async () => {
      const res = await request(app)
        .get('/api/404')
        .expect(httpStatus.NOT_FOUND);

      expect(res.body.message).to.equal('Not Found');
    });
  });
});
