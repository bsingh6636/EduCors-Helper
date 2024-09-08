export const deletePartobject = (user) => {
    let userObject;

    if (typeof user === 'object' && user !== null) {
        // Check if user has toObject() method (likely a Mongoose document)
        if (typeof user.toObject === 'function') {
            userObject = user.toObject();
        } else {
            userObject = { ...user }; // Clone the object to avoid mutating the original
        }
    } else {
        console.log('Input is not an object');
        return null; // Return null or handle as needed
    }

    // Delete specified properties if they exist
    delete userObject.Password;
    delete userObject.updatedAt;

    // Log to verify if properties are deleted

    return userObject;
};
