const joi = require('joi')
const models = require('../db/models');
const {Op} = require('sequelize');
const {groupBy} = require('../utils/multiple.create')
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
      const findRoles = await models.roles.findAll({where:{created_by_id:params.user.id, deletedAt:null},raw:true})
        if(!findRoles.length){
            throw new Error('User does not have active custom roles')
        }

    let findRolesId = findRoles.map((ids)=>{
        return ids.id
    });
    let findRoleName =  findRoles.map((ids)=>{
        return {role_id:ids.id,role_name:ids.name}
    });
   

    const findPerms = await models.roles_permissions.findAll({where:{
        roles_id:{[Op.in]:findRolesId}
    },raw:true});
    // // console.log({findPerms:findPerms})
    const endpointids = findPerms.map((item)=>{
        return item.endpoint_id
    });
    // // console.log({endpointids:endpointids})
  
    // let 
    
    const endpoints =  await models.endpoints.findAll({where:{
        id:{[Op.in]:endpointids}
    },raw:true});
    // const final_response = findPerms.forEach(element,index => {
    //     if(element.endpoint_id === endpointids ){
    //         console.log({endpointids:endpointids})
    //     }
    // });
    // console.log(endpoints,"endpoints")
    // endpoints.map(endpoints,index=>{
    //     findPerms.filter((item)=>{
    //         if(item.endpoint_id === endpoints[index] ){
    //             console.log({name:endpoints.name,path:endpoints.path,description:endpoints.description})
    //         }
    //     })
    //     // if (permissions[findRolesId] && )
    //     // console.log("endpoints",endpoints)
    // })


let endpoints_paths= []
    endpoints.map((endpts, index) => {
        findPerms.map((permissions) => {
            findRoleName.map((roles) => {
                if (permissions.endpoint_id === endpts.id && permissions.roles_id === roles.role_id) {
                    endpoints_paths.push({
                        role_name:roles.role_name,
                        permissions:{path: endpts.path,
                        description: endpts.description}
                    })
                }
            })
        })

    })
    // console.log(endpoints_paths)
const groupByKey = (list, key) => list.reduce((hash, obj) => ({...hash, [obj[key]]:( hash[obj[key]] || [] ).concat(obj)}), {})

 endpoints_paths = groupByKey(endpoints_paths, 'role_name');
response.rolesInfo = findRoleName
 response.roles_permissions = endpoints_paths
 return response

    } catch (error) {
        throw new Error(error);
    }
}


module.exports = service;