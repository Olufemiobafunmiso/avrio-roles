const models = require('../db/models');


async function service() {
    let response;
    try {
        
         response  = await models.endpoints.findAll({where:{deletedAt:null},raw:true, attributes:['id','path','description','method'], order: [
            ['id', 'ASC']
        ]})

        return response

    } catch (error) {
        throw new Error(error);
    }
}


module.exports = service;