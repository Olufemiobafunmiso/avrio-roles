const create = require('../services/createWorkplace');
const chai = require('chai');
const expect = chai.expect;


describe('Create Workspaces', function () {

    describe('ERROR TEST', () => {
  
      it('Should throw error if email is not passed', async() => {
          const payload = {"name":"Pr Team"}
          try {
              await create(payload);
          } catch (error) {
              expect(error.message).to.equal('Error: "email" is required');
          }
       
      });
  
      it('Should throw error if name is not passed', async() => {
          const payload = {"email":`user${Date.now()}@xy.com`}
          try {
              await create(payload);
          } catch (error) {
              expect(error.message).to.equal('Error: "name" is required');
          }
       
      });
  
    });
  
    describe('VALID TEST', () => {
  
      it('Should create user and return response if all required parameters are passed', async() => {
          let user = { id: 2,
            first_name: 'olufemi',
            last_name: 'obafunmiso',
            uuid: '7a17833d-0270-4310-a87c-3ea5ecc6950f',
            email: 'user@xy.com'}
          const payload =  {"name":"Pr Team", "email":`user${Date.now()}@xy.com`,user}
          let result = false;
          try {
               result = await create(payload);
          } catch (error) {}
          expect(result).to.be.an('object');
          expect(result).to.have.property('workspace_id');
          expect(result).to.have.property('owner_id');
          expect(result).to.have.property('website');
          expect(result).to.have.property('isOwner');
      });
  
    });
  
  });