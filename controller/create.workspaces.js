const service = require('../services/createWorkplace')
module.exports = function (req, res, next){

	service(req.body)
	.then( result => {
        res.status(200).json({status:'success',data: result})
	})
	.catch( err => {
        res.status(500).json({status:'error',error: err.message})
	});
  

}