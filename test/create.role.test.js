const create = require('../services/create.role');
const chai = require('chai');
const expect = chai.expect;
const Mock_data = require('./mock.data').create_role


describe('Create  Role', function () {

    describe('ERROR TEST', () => {
  
      it('Should throw error if user has created role already', async() => {
        let result;
          try {
            result = await create(Mock_data);
          } catch (error) {
              expect(error.message).to.equal('Error: User already created role');
          }
      });
  
      it('Should throw error if invalid permission id is passed', async() => {
          Mock_data.role_name = `New-Test${Date.now()}`
          Mock_data.permissions={"43":true}
          let result;
          try {
             result =  await create(Mock_data);
          } catch (error) {
              expect(error.message).to.equal('Error: Invalid permission ID entered');
          }
       
      });
  
    });
  
    describe('VALID TEST', () => {
  
      it('Should create user and return response if all required parameters are passed', async() => {
        Mock_data.role_name = `Olufemi-new ${Date.now()}TT`  
        Mock_data.permissions={"1":true,"2":true,"3":true}
          let result = false;
          try {
               result = await create(Mock_data);
          } catch (error) {
              console.log(error)
          }
          console.log(result)
          expect(result).to.be.an('object');
          expect(result).to.have.property('role_id');
          expect(result).to.have.property('name');
          expect(result).to.have.property('permissions');
      });
  
    });
  
  });