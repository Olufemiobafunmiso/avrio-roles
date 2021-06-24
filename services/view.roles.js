const joi = require('joi')
const models = require('../db/models');
const {Op} = require('sequelize');
//=======Schema Validation with joi==========//

const schema = joi.object({
    workspace_id: joi.number().required(), 
    email: joi.string().email({minDomainSegments: 2}).messages({'string.email': 'Invalid email passed.' }).trim().required(),
    user:joi.alternatives().try(joi.object(), joi.array()).required(),
    role:joi.alternatives().try(joi.object(), joi.array()).required(),
    
});
//============================================//

async function service(data) {

    let response = {};
    try {
        // Validate req.body against the defined schema
        const validation = schema.validate(data);
        const {value,error } = validation;
        const params = value;

        if (error) {
            const message = error.details.map(x => x.message);
            throw new Error(message)
        }
      const findRoles = await models.roles.findAll({where:{created_by_id:params.user.id, deleted_at:null}, attributes:['name','description'],raw:true})
        if(!findRoles.length){
            throw new Error('User does not have active custom roles')
        }
        response.roles = findRoles
        return response;

    } catch (error) {
        // console.log("<<<>?>>>>>>",error)
        throw new Error(error);
    }
}


module.exports = service;