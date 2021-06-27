const models = require('../db/models');
const joi = require('joi');
const validator = require('../utils/validator')
module.exports = async function (req, res, next) {

    
    try { 
      /**This bit can be optimized and be using user_id rather than
       * using email to indentify user.
       * But security wise, attackers can start passing random user_ids
       * The best bet will be that at login, a jwt access token is generated and embedded 
       * in this token will be the user_id, user email and all necessary info.
       * So for every API call, the Jwt token generated at login is passed on the headers
       * and this Middle first decode/ verify the jwt token passed and use the info e.g email and is to further query the db
       * rather than user passing the email plain as it is right now.
       * e.g Headers: Avrio-auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZ
       * For external developers that want to use the APIs, they can be passing Bearer token by passing the User_id.
       * e.g Authorization : Bearer {user_id}
       */
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