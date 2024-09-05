export const deletePartobject = (user) =>{
    
    if(typeof(user)=='object'){
        const userObject = user
        delete userObject.Password
        delete userObject._id
        delete userObject.updatedAt
        return userObject
    }
   else{
    const userObject = user.toObject()
    delete userObject.Password
    delete userObject._id
    delete userObject.updatedAt
    return userObject
   }
}