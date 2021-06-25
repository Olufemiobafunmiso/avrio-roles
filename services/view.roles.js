const joi = require('joi')
const models = require('../db/models');
const {Op} = require('sequelize');
const roles_permissions = require('../db/models/roles_permissions');
//=======Schema Validation with joi==========//

const schema = joi.object({
    workspace_id: joi.number().required(), 
    email: joi.string().email({minDomainSegments: 2}).messages({'string.email': 'Invalid email passed.' }).trim().required(),
    user:joi.alternatives().try(joi.object(), joi.array()).required(),
    role:joi.alternatives().try(joi.object(), joi.array()).required(),
    role_id: joi.number(), 
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
      const findRoles = await models.roles.findAll({where:{created_by_id:params.user.id, deleted_at:null}, include:{model:models.endpoints},raw:true})
        if(!findRoles.length){
            throw new Error('User does not have active custom roles')
        }

    // let findRolesId = findRoles.map((ids)=>{
    //     return ids.id
    // });
    // // console.log({findRolesId:findRolesId})
    // const findPerms = await models.roles_permissions.findAll({where:{
    //     roles_id:{[Op.in]:findRolesId}
    // },raw:true});
    // // console.log({findPerms:findPerms})
    // const endpointids = findPerms.map((item)=>{
    //     return item.endpoint_id
    // });
    // // console.log({endpointids:endpointids})
    // const endpoints =  await models.endpoints.findAll({where:{
    //     id:{[Op.in]:endpointids}
    // },raw:true});
    // // const final_response = findPerms.forEach(element,index => {
    // //     if(element.endpoint_id === endpointids ){
    // //         console.log({endpointids:endpointids})
    // //     }
    // // });

    // console.log(final_response)
        response.roles = findRoles
        return response;

    } catch (error) {
        // console.log("<<<>?>>>>>>",error)
        throw new Error(error);
    }
}


module.exports = service;