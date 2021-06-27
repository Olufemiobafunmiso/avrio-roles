const service = require('./create.role.json');
module.exports = function (req, res, next){
    try {
        res.set('Content-type', 'text/json');
        return res.send(service);
      } catch (e) {
        return res.json({
          status:"Failed",
          message:"quickdocs not available"
        });
      }
  

}