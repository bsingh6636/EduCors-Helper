export const deletePartobject = (user) =>{
    const userObject = user.toObject()
    delete userObject.Password
    delete userObject._id
    delete userObject.updatedAt
    delete userObject.ApiKey
    return userObject
}