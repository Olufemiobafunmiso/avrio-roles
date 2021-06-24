const joi = require('joi');

const schema = joi.object({
    email: joi.string().email({minDomainSegments: 2}).messages({'string.email': 'Invalid email passed.','any.required':'User is a required parameter'}).trim().required(),
});
const  validator = (data)=>{
    try {
        const validation = schema.validate(data);
        const {value,error } = validation;
      
        if (error) {
            const message = error.details.map(x => x.message);
            throw new Error(message)
        }
    } catch (error) {
        throw error
    }
  
}

module.exports = validator