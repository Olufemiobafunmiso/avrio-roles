const joi = require('joi')
const models = require('../db/models');
const {Op} = require('sequelize');
const updateOrCreate = require('../utils/updateOrCreate')

//=======Schema Validation with joi==========//

const schema = joi.object({
    workspace_id: joi.number().required(), 
    role_name: joi.string().trim(), 
    role_description: joi.string(), 
    permissions:joi.alternatives().try(joi.object().min(1)).required(),
    email: joi.string().email({minDomainSegments: 2}).messages({'string.email': 'Invalid email passed.' }).trim().required(),
    user:joi.alternatives().try(joi.object(), joi.array()).required(),
    role:joi.alternatives().try(joi.object(), joi.array()).required(),
    role_id:joi.number().required(), 
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
        // console.log(params.role)
        // if(params){
        //   throw new Error('cut')
        // }
        //check if roles exist
        const isRoleExist = await models.roles.findOne({where:{id:params.role_id, created_by_id:params.role.isOwnerRole[0].users_id},raw:true})
        if(!isRoleExist){
          throw new Error('Role does not exist')
        }
        const permIds = Object.keys(params.permissions);

         const getAllEndpoints = await models.endpoints.findAll({
            where: {
              id: {[Op.in]:permIds}
            },raw:true
          });

            //check if the permission ids passed are valid
         if(getAllEndpoints.length != permIds.length){
            throw new Error('Invalid permission ID entered')
          }
          //check permissions
          const check_permissions = await models.roles_permissions.findAll({where: {
            id: {[Op.in]:permIds},
            deletedAt:null
          },raw:true})

          // console.log(check_permissions,"check_permissions")
 
          /**
           * Sequelize upsert() return `false` is row is updated and `true` if row is created, this is not intuitive for this flow 
           */
          
        //  const update_or_create = await updateOrCreate(models.roles_permissions,{ 
        //              roles_id:params.role_id,
        //              endpoint_id:{[Op.in]:permIds}
        //          })
        //  const create_role = await models.roles.create({
        //     name:params.role_name,
        //     description:params.role_description,
        //     created_by_id:1
        // });
        // console.log({create_rolezzzzzzz:create_role.id})
  
//          console.log({create_role:create_role})
         const role_endpoint_data = [];
         const delete_endpoint =[]
         let permissionsArr = check_permissions.map((item)=>{
           return item.endpoint_id
         })
    

getAllEndpoints.forEach((endpoint,index)=>{
          if (params.permissions[endpoint.id] === true && !permissionsArr.includes(endpoint.id) ) {
              role_endpoint_data.push({
                roles_id:params.role_id,
                endpoint_id: endpoint.id
              }) 
            }
            if (params.permissions[endpoint.id] === false && permissionsArr.includes(endpoint.id)) {
              delete_endpoint.push({
                roles_id:params.role_id,
                endpoint_id: endpoint.id,
                deletedAt:Date.now()
              }) 
            }

})      
console.log("delete_endpoint",delete_endpoint)
          let bulkCreate;
          let bulkDelete;
          if (role_endpoint_data.length){
            //  bulkCreate = await roles_permissions.bulkCreate(role_endpoint_data, 
            //   {
            //       fields:["roles_id", "endpoint_id"],
            //       ignoreDuplicates: true,returning:true
            //   } );
            bulkCreate = await models.roles_permissions.bulkCreate(role_endpoint_data, { returning: true, attributes:['id']})
          };
          if(delete_endpoint.length){
            roles_ids = delete_endpoint.map((id)=> id.roles_id);
            endpointIds = delete_endpoint.map((id)=> id.endpoint_id);
            console.log(endpointIds,"roles_ids")
            bulkDelete = await models.roles_permissions.destroy({
              where: {
                roles_id: {[Op.in]:roles_ids},
                endpoint_id: {[Op.in]:endpointIds}
              }
            });
          }

console.log({bulkDelete:bulkDelete})

 

        return check_permissions;

    } catch (error) {
      console.log(error)
        throw new Error(error);
    }
}


module.exports = service;