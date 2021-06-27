const create = require('../services/createUser');
const chai = require('chai');
const expect = chai.expect;


describe('Create User', function () {

  describe('ERROR TEST', () => {

    it('Should throw error if email is not passed', async() => {
        const payload = {
            "first_name": "olufemi",
            "last_name": "obafunmiso"
        }
        try {
            await create(payload);
        } catch (error) {
            expect(error.message).to.equal('Error: "email" is required');
        }
     
    });

    it('Should throw error if password is not passed', async() => {
        const payload = {
            "first_name": "olufemi",
            "last_name": "obafunmiso",
            "email":`user${Date.now()}@y.com`
        }
        try {
            await create(payload);
        } catch (error) {
            expect(error.message).to.equal('Error: "password" is required');
        }
     
    });


    it('Should throw error if user exist already', async() => {
     const payload = {"first_name":"olufemi",
        "last_name":"obafunmiso",
        "email":`user@xyy.com`,
        "password":`@Olufemi_Oba${Date.now()}`
        }
        try {
            await create(payload);
        } catch (error) {
            expect(error.message).to.equal('Error: User already exist');
        }
     
    });

  });

  describe('VALID TEST', () => {

    it('Should create user and return response if all required parameters are passed', async() => {
        const payload = {"first_name":"olufemi",
        "last_name":"obafunmiso",
        "email":`example${Date.now()}@y.com`,
        "password":`@Olufemi_Oba${Date.now()}`
        }
        let result = false;
        try {
         result = await create(payload);
        } catch (error) {}
        expect(result).to.be.an('object');
        expect(result).to.have.property('id');
        expect(result).to.have.property('uuid');
        expect(result).to.have.property('password');
        expect(result).to.have.property('first_name','olufemi');
    });

  });

});


