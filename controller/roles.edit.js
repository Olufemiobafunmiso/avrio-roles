const service = require('../services/edit.role')
module.exports = async function (req, res, next){

	service(req.body)
	.then( result => {
        return res.json({status:'Roles Edit successful',data: result})
         
	})
	.catch( err => {
        return  res.json({status:'error',error: err.message})
        
	});
  

}