const updateOrCreate =  async(model, where)=> {

 
    try {
           
    const create_entry = {
        roles_id:where.roles_id,
        endpoint_id:where.roles_id
    }
      // First try to find the record
   const foundItem = await model.findOne({where});
 
   if (!foundItem) {
        // Item not found, create a new one
        const new_item = await model.create(create_entry,{raw:true});
  
        return  {id:new_item.id, created:true,status:'success'};
    }
    // Found an item, update it
    const item =  await foundItem.update({secret_token:token});
    return {item, updated:true,id:foundItem.id,status:"success"};
    
    } catch (error) {

        return {status:'error',message:error.mesage}
    }

   
}

module.exports = updateOrCreate
