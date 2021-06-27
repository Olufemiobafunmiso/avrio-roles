const joi = require('joi')
const models = require('../db/models');
const { uuid } = require('uuidv4');
const crypto = require("crypto");
// const permissions = require('./all.permissions');
// const createMultiple = require('../utils/multiple.create');
// const create = require('../utils/multiple.create');
//=======Schema Validation with joi==========//

const schema = joi.object({
    name: joi.string().required(), 
    email: joi.string().email({minDomainSegments: 2}).required(),
    user:joi.alternatives().try(joi.object(), joi.array()).required(),
    
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
       const creatWorkspacePayload = {
        uuid:uuid(),
        name:params.name,
        website:`${params.name.trim()}/workspaces/${crypto.randomBytes(5).toString('hex')}`,
        created_by:params.user.id
        }

        //Could have use include operator to create but include(join) can be quite expensive and cause latency
         const creatWorkspace  = await models.workspaces.create(creatWorkspacePayload);
        //  const createOwnerRole = await models.roles.create({name:'Owner',created_by_id:params.user.id});
        //Owners role is created by the admin and automatically assign to workspace creator, rather than always creating owners role, we can easily assign it to workspace  creator
         const createUserAccountMaps = await models.user_account_maps.create({is_owner:1,users_id:params.user.id,workspace_id:creatWorkspace.id,role_id:1}); //1 is Owner's role
        //  const getAllPermissions = await permissions()


         /**This is not required since the owners role has access to every permission,
          * there's therefore no need to create permissions.
          */
        //  //create permissions
        // //  if(getAllPermissions.length){
        // //     getAllPermissions.forEach (async(element => {
        // //         await createMultiple(models.roles_permissions,{roles_id:createOwnerRole.id,endpoint_id:element.id})
        // //     });
        // //  }
        //  if(getAllPermissions.length){
        //     getAllPermissions.forEach (async(element)=>{
        //     await createMultiple(models.roles_permissions,{roles_id:createOwnerRole.id,endpoint_id:element.id})
        //     })
        //  }
        
         response = {
            workspace_id: creatWorkspace.id,
            owner_id:params.user.id,
            website: creatWorkspace.website,
            owner: params.email,
            isOwner: createUserAccountMaps.is_owner
        }

        return response

    } catch (error) {
        console.log(error)
        throw new Error(error);
    }
}


module.exports = service;