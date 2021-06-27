const permissions = require('../services/all.permissions');
const chai = require('chai');
const expect = chai.expect;


describe('Retrieve all permissions', function () {

  describe('Valid test', () => {

    it('Should return all permissions', async() => {
      const result = await permissions();
      expect(result).to.be.an('array');
      expect(result[0]).to.have.property('id');
      expect(result[0]).to.have.property('path');
      expect(result[0]).to.have.property('description');
      expect(result[0]).to.have.property('method');
    });

  });

});
