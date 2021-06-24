const service = require('../services/view.roles.js')
module.exports = function (req, res, next){

    req.body.email = req.query.email || req.headers.email
    req.body.workspace_id = req.params.workspace_id
	service(req.body)
	.then( result => {
        res.status(200).json({status:'success',data: result})
	})
	.catch( err => {
        res.status(500).json({status:'error',error: err.message})
	});
  

}