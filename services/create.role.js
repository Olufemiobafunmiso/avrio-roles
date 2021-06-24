const joi = require('joi')
const models = require('../db/models');
const {Op} = require('sequelize');
//=======Schema Validation with joi==========//

const schema = joi.object({
    workspace_id: joi.number().required(), 
    role_name: joi.string().trim().required(), 
    role_description: joi.string(), 
    permissions:joi.alternatives().try(joi.object().min(1)).required(),
    email: joi.string().email({minDomainSegments: 2}).messages({'string.email': 'Invalid email passed.' }).trim().required(),
    user:joi.alternatives().try(joi.object(), joi.array()).required(),
    role:joi.alternatives().try(joi.object(), joi.array()).required(),
    
});
//============================================//

async function service(data) {
// console.log(data,"#######")
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
        const permIds = Object.keys(params.permissions);

         const getAllEndpoints = await models.endpoints.findAll({
            where: {
              id: {[Op.in]:permIds}
            },raw:true
          });
        //   console.log(getAllEndpoints)
            //check if the permission ids passed are valid
         if(getAllEndpoints.length != permIds.length){
            throw new Error('Invalid permission ID entered')
          }
          
          //check if role has been created already by the user
        const check_role = await models.roles.findOne({where:{
            name:params.role_name,
            created_by_id:1
        },raw:true})
        // console.log({check_role:check_role})
         if(check_role){
             throw new Error('User already created role');
             
         }
         
         const create_role = await models.roles.create({
            name:params.role_name,
            description:params.role_description,
            created_by_id:1
        });
        // console.log({create_rolezzzzzzz:create_role.id})
  
//          console.log({create_role:create_role})
         const role_endpoint_data = [];
         getAllEndpoints.map(endpoint => {
            if (params.permissions[endpoint.id] === true) {
              role_endpoint_data.push({
                roles_id:create_role.id,
                endpoint_id: endpoint.id
              }) 
            }
          })
// console.log("role_endpoint_data<<<>>>>>>")
          const bulkCreate = await models.roles_permissions.bulkCreate(role_endpoint_data, { returning: true})
        // console.log(bulkCreate,"bulkCreate")
        if(bulkCreate){
            // console.log(">>>>>",create_role.id)
            response.roles_permissions = create_role.id,
            response.role = create_role,
            response.permissions = bulkCreate
        }
 

        return response;

    } catch (error) {
        // console.log("<<<>?>>>>>>",error)
        throw new Error(error);
    }
}


module.exports = service;