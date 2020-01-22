import request from 'supertest';
import httpStatus from 'http-status';
import chai from 'chai';
import app from '../../../index';
import versionRouter from '../versionRouter';

const { expect } = chai;
chai.config.includeStack = true;

describe('# Version Router', () => {
  describe('## Handling requests', () => {
    it('should return the new handler > 10', async () => {
      const res = await request(app)
        .get('/api/test/version-router/multi')
        .set('app-build', 11)
        .expect(httpStatus.OK);

      expect(res.body.message).to.equal('handler>10');
    });

    it('should return the old handler <= 10', async () => {
      const res = await request(app)
        .get('/api/test/version-router/multi')
        .set('app-build', 10)
        .expect(httpStatus.OK);

      expect(res.body.message).to.equal('handler<=10');
    });

    it('should return the default handler', async () => {
      const res = await request(app)
        .get('/api/test/version-router/default')
        .expect(httpStatus.OK);

      expect(res.body.message).to.equal('default-handler');

      const res2 = await request(app)
        .get('/api/test/version-router/default')
        .set('app-build', 99)
        .expect(httpStatus.OK);

      expect(res2.body.message).to.equal('default-handler');
    });
  });

  it('should throw an error for invalid config', async () => {
    expect(versionRouter).to.throw('missing version router config');

    // @ts-ignore Intentional test
    expect(() => versionRouter({})).to.throw('missing version router config');
    expect(
      // @ts-ignore Intentional test
      () => versionRouter({ otherwise: [] }),
    ).to.not.throw('missing version router config');
  });
});
