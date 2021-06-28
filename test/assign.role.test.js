const create = require('../services/assign.role');
const chai = require('chai');
const expect = chai.expect;
const Mock_data = require('./mock.data').assign_role
const models = require('../db/models')

describe('Assign  Role', function () {

    describe('ERROR TEST', () => {
  
      it('Should throw error if invitee has been assigned role', async() => {
        let result;
          try {
            result = await create(Mock_data);
          } catch (error) {
              console.log(error)
              expect(error.message).to.equal('User with email loremIpsum@example.com already has role_id 19 on this workspace.');
          }
      });
  
      it('Should throw error if invitee email does not exist', async() => {
        let result;
        Mock_data.invitee_email=`tttt${Date.now()}@Og.com`
          try {
            result = await create(Mock_data);
          } catch (error) {
              expect(error.message).to.equal('Error: Invitee email does not exist');
          }
      });
  

    });
  
    describe('VALID TEST', () => {
  
      it('Should assign role to invitee email', async() => {
        
       Mock_data.invitee_email = `example1624815344902@y.com`
          let result = false;
          //This is to make this test always run
          const updateDb = async()=>{
              let response;
              const isInviteeValid = await models.users.findOne({where:{email:Mock_data.invitee_email},raw:true});
              response = await models.user_account_maps.destroy({where:{role_id:Mock_data.role_id,users_id:isInviteeValid.id}})
            return response
          }
          updateDb()
          try {
           
               result = await create(Mock_data);
          } catch (error) {}
          expect(result).to.be.an('object');
          expect(result).to.have.property('workspace_id');
          expect(result).to.have.property('role_id');
          expect(result).to.have.property('users_id');
          expect(result).to.have.property('is_owner');
      });
  
    });
  
  });