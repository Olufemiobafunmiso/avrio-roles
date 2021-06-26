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

const groupBy = (xs,f)=>{
    return xs.reduce((r, v, i, a, k = f(v)) => ((r[k] || (r[k] = [])).push(v), r), {});
}


module.exports={create,groupBy}