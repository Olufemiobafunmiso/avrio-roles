const joi = require('joi')
const models = require('../db/models');
const {Op} = require('sequelize');


//=======Schema Validation with joi==================//
const schema = joi.object({
    workspace_id: joi.number().required(),
    invitee_email: joi.string().email({minDomainSegments: 2}).messages({'string.email': 'Invalid email passed.' }).trim().required(),
    user:joi.alternatives().try(joi.object(), joi.array()).required(),
    role:joi.alternatives().try(joi.object(), joi.array()).required(),
    role_id:joi.number().required(), 
});
//================================================//

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


        /**
         * Check if role exist  permAuth Middle should have intercept 
         *  this but if for some unseen bugs, it escapes it, then this bit will handle it
         */
            const isRoleExist = await models.roles.findOne({
                where: {
                    id: params.role_id,
                    [Op.or]: [{
                        workspaces_id: params.workspace_id
                    }, ]
                },
                raw: true
            });

    if(!isRoleExist){
        throw new Error('Role does not exist')
      }

      const assign_role  = await models.user_account_maps.create({workspace_id:params.workspace_id,role_id:params.role_id,users_id:params.user.id});
        response.data = assign_role
        return response;

    } catch (error) {
        throw new Error(error);
    }
}


module.exports = service;