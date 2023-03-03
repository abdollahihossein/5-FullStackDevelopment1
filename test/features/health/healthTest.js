const chai = require('chai');
const sinon = require('sinon');
const HealthController = require('../../../src/features/health/health.controller');
const ResponseUtil = require('../../../src/shared/utils/response-util').ResponseUtil;

describe('HealthController', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('#helloWorld()', () => {
    it('respond with Hello World!!', (done) => {
      sinon.stub(ResponseUtil,'respondOk').callsFake((res, data ,message) => {
        chai.assert.equal(message,'Hello World!!');
        done();
      });
      
      void HealthController.helloWorld();
    });
  });

  describe('#status()', () => {
    it('respond with Environment name and running port', (done) => {
      sinon.stub(ResponseUtil, "respondOk").callsFake((res, data, message) => {
        const port = process.env.PORT || 3004;
        const envName = process.env.ENV_NAME;
        chai.assert.equal(message, `Environment '${envName}' running on port: ${port}`);
        done();
      });

      void HealthController.status();
    });
  });

});
