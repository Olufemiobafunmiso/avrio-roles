const models = require('../db/models');
const joi = require('joi');
const validator = require('../utils/validator')
module.exports = async function (req, res, next) {

    
    try {
            const user = req.body.email || req.query.email || req.headers.email
           
              validator({email:user})

    //Check if User exists
       const check_user = await models.users.findOne({where:{email:user},raw:true});
   
       if(!check_user){

       throw new Error('ERROR_RESPONSE_SENT') //Ideally this will not occur if its just FE level, but BE still need to ensure this check is in place.
    };
// console.log(check_user)
       if (check_user) {
           req.body.user = check_user
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


// }