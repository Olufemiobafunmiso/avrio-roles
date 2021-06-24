const service = require('../services/create.role')
module.exports = async function (req, res, next){

	service(req.body)
	.then( result => {
        return res.json({status:'Role and Permissions created.',data: result})
         
	})
	.catch( err => {
        return  res.json({status:'error',error: err.message})
        
	});
  

}