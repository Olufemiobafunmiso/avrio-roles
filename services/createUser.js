const joi = require('joi')
const models = require('../db/models');
const { uuid } = require('uuidv4');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const crypto = require("crypto");
//=======Schema Validation with joi==========//

const schema = joi.object({
    first_name: joi.string().trim().required(), 
    last_name: joi.string().trim().required(),
    email: joi.string().email({minDomainSegments: 2}).messages({'string.email': 'Invalid email passed.' }).trim().required(),
    picture: joi.string(),
    password: joi.string().regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/).messages({'string.pattern.base': 'Password must be at least 8 characters long, containing at least 1 uppercase letter, a lowercase letter, a number, and a special character.' }).required()
    
});
//============================================//

async function service(data) {
    let response;
    try {
        // Validate req.body against the defined schema
        const validation = schema.validate(data);
        const {value,error } = validation;
        const params = value;

        if (error) {
            const message = error.details.map(x => x.message);
            throw new Error(message)
        }
        //check if User exists already
        const check_user = await models.users.findOne({where:{email:params.email},raw:true});
    
        if(check_user){
            throw new Error('User already exist') //Ideally this will not occur if its just FE level, but BE still need to ensure this check is in place.
        }
        const hashedPassword = await bcrypt.hash(params.password, 10);
        const payload = {
            uuid:uuid(),
            first_name:params.first_name,
            last_name:params.last_name,
            password:hashedPassword,
            auth_id:crypto.randomBytes(5).toString('hex'),
            email:params.email,
            verified:true //This is an assumption, there can be criterias before a user is verified

        }
         response  = await models.users.create(payload)

        return response

    } catch (error) {
        throw new Error(error);
    }
}


module.exports = service;