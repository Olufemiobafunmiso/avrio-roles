const joi = require('joi')
const models = require('../db/models');
const {Op} = require('sequelize');

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
		
        // const isRoleExist = await models.roles.findOne({where:{id:params.role_id, created_by_id:params.role.isOwnerRole[0].users_id}});

			const isRoleExist = await models.roles.findOne({where:{id:params.role_id,
				[Op.or]: [{workspaces_id:params.workspace_id}]
			}});


        if(!isRoleExist){
          throw new Error('Role does not exist')
        }
        if(params.role_name !== isRoleExist.name || params.role_description !==isRoleExist.description){
          isRoleExist.name = params.role_name
          isRoleExist.description = params.role_description
         
          await isRoleExist.save()
        }
    

        response.name = params.role_name
        response.description =  params.role_description
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
            roles_id: params.role_id,
            // deletedAt:null,
           
          },raw:true})
          const checkDeletedRoles = await models.roles_permissions.findAll({
            where: {
              roles_id: params.role_id,
                 deletedAt: {
              [Op.ne]: null
            }
            },
            raw: true,
         
            paranoid: false
          })
          let deletedPermission= checkDeletedRoles.map((item)=>{
            return item.endpoint_id
          });

         const role_endpoint_data = [];
         const delete_endpoint =[];
         const restoreDeleted = [];
         let permissionsArr = check_permissions.map((item)=>{
           return item.endpoint_id
         })
    

        getAllEndpoints.forEach((endpoint, index) => {

          //Fresh permissions
          if (params.permissions[endpoint.id] === true && !permissionsArr.includes(endpoint.id) && !deletedPermission.includes(endpoint.id)) {
            role_endpoint_data.push({
              roles_id: params.role_id,
              endpoint_id: endpoint.id,
							workspaces_id:params.workspace_id
            })
          }
          //delete old permissions
          if (params.permissions[endpoint.id] === false && permissionsArr.includes(endpoint.id)) {
            delete_endpoint.push({
              roles_id: params.role_id,
              endpoint_id: endpoint.id
              // deletedAt: Date.now()
            })
          }
          //restore previous permissions
          if (params.permissions[endpoint.id] === true && deletedPermission.includes(endpoint.id)) {
            restoreDeleted.push({
              roles_id: params.role_id,
              endpoint_id: endpoint.id
              // deletedAt: Date.now()
            })
          }

        })
          let restoreRoles;
          let bulkCreate;
          let bulkDelete;
          if(restoreDeleted.length){
           let idsRoles =  checkDeletedRoles.map((_id)=>{
            return _id.roles_id
           })
           restoreRoles = await models.roles_permissions.restore({
              where: {
                roles_id:{[Op.in]:idsRoles} ,
                endpoint_id: {[Op.in]:deletedPermission}
              }
            });
          }
          if (role_endpoint_data.length){
            bulkCreate = await models.roles_permissions.bulkCreate(role_endpoint_data,{ updateOnDuplicate: ["roles_id", "endpoint_id", "createdAt"] }, { returning: true})
          };
          if(delete_endpoint.length){
            roles_ids = delete_endpoint.map((id)=> id.roles_id);
            endpointIds = delete_endpoint.map((id)=> id.endpoint_id);
            bulkDelete = await models.roles_permissions.destroy({
              where: {
                roles_id: {[Op.in]:roles_ids},
                endpoint_id: {[Op.in]:endpointIds}
              }
            });
          }



 const recheck_permissions = await models.roles_permissions.findAll({
 	where: {
 		roles_id: params.role_id,
 		deletedAt: null
 	},
 	raw: true,
 	attributes: ['roles_id', 'endpoint_id']
 })
response.permissions = recheck_permissions
        return response;

    } catch (error) {

        throw new Error(error);
    }
}


module.exports = service;