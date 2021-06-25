const models = require('../db/models');
const {Op} = require('sequelize');
const endpoints = require('../services/all.permissions');
module.exports = async function (req, res, next) {

    
    try {
    const workspace_id =  req.body.workspace_id || req.params.workspace_id || req.headers.workspace_id
	let path = req.baseUrl + '' + req.path;
	path = path.replace(/\/\d+/g, '/__param__'); //remember to replace any digit in path with __param__ so it matches parameterized urls
	let lastChar = path.substr(-1);
    
	//this is to normalize times when we have a mismatch between name of path in db and what's passed
	if(lastChar == "/"){
		path = path.substr(0, path.length - 1);
	}
    const method = req.method


    //Users role, findall because user can have more than one role
    const membership = await  models.user_account_maps.findAll({where:{workspace_id:workspace_id,users_id:req.body.user.id}, raw:true});
    // console.log({membership:membership})
    if(!membership.length){

       throw new Error('User does not have access to this workspace')
    }
    let role_id = membership.map((m)=>m.role_id)

    //findall because user can have more than one role
    // console.log({role_id:role_id})
    const check_role = await models.roles.findAll({where:{
        id:{
          [Op.in]: role_id
        }
    },raw:true})
    // console.log({check_role:check_role})
    if(!check_role){
       throw new Error('User does not have any role')

    }
    // console.log({check_role:check_role})
    const isOwnerOrEveryone = check_role && check_role.filter((item)=>{
       return item.name ==='owner' || item.name === 'everyone'
    }) 
    console.log({isOwnerOrEveryone:isOwnerOrEveryone})
    // CALL NEXT MIDDLEWARE IF USER IS OWNER OR HAS EVERYONE ROLE
    if(isOwnerOrEveryone.length){
        req.body.role = check_role
        next();
        return;
    }
    
    const check_other_roles = check_role.map((item)=>{return item.id})
  
    const endpoint_path = await endpoints()
    if(!endpoint_path){
        //This means the path does not need permissions
        next()
        return;
    }

    const getPath = endpoint_path && endpoint_path.filter((item)=>{

        return item.path === path && item.method === method
    })

    let getpath_id = getPath.map((item)=>{return item.id})
  

    //if other roles, then check for permissions

    const check_permission = getpath_id && await models.roles_permissions.findAll({where:{
        roles_id:{[Op.in]:check_other_roles},
        endpoint_id:Number(getpath_id.toString())
    },raw:true})

    if(!check_permission.length){
       throw new Error('User does not have permission. Kindly contact administrator');
    }
    if(check_permission){
        req.body.role = check_role
        next()
    }
    } catch (error) {

        res.status(401).json({
            status: "error",
            code: "UNAUTHORIZED_ACCESS",
            message: error.message
         
       })

    }


}