const view = require('../services/view.roles');
const chai = require('chai');
const Mock_data = require('./mock.data').view_roles;
const expect = chai.expect;


describe('View Roles', function () {

    describe('ERROR TEST', () => {
  
      it('Should throw error if user does not have active custom roles', async() => {
            Mock_data.user.id = 9004
          try {
             await view(Mock_data);
          } catch (error) {
            console.log(error)
              expect(error.message).to.equal('Error: User does not have active custom roles');
          }
      });

  
    });
  
    describe('VALID TEST', () => {
  
      it('Should return roles and permissions', async() => {
        Mock_data.user.id = 46
       
          let result = false;
          try {
               result = await view(Mock_data);
          } catch (error) {}
          expect(result).to.be.an('object');
          expect(result).to.have.property('rolesInfo');
          expect(result).to.have.property('roles_permissions');
      });
  
    });
  
  });