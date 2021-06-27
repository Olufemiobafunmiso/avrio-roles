const service = require('../services/assign.role')
module.exports = async function (req, res, next){

	service(req.body)
	.then( result => {
        return res.json({status:'Role assign successfully',data: result})
         
	})
	.catch( err => {
        return  res.json({status:'error',error: err.message})
        
	});
  

}