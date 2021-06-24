const create = async(model,payload)=>{
    // console.log("payload>>>>>>",payload)
    let response;
    try {
        response  = await model.create(payload)

    } catch (error) {
        throw new Error(error.message)
    }
return response
}

module.exports=create