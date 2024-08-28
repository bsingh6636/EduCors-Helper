import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const UserSchema = mongoose.Schema({
    UserName: {
        type: String,
        required: true
    },
    Name: {
        type: String,
        required: true,
    },

    Email: {
        type: String,
        required: true
    },
    Country: {
        type: String,
        // required : true
    },
    Password : {
        type : String , 
        required : true 
    } ,
    ApiKey : {
        type : String ,
    }
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
    if (!this.isModified('Password')) next();
    const salt = await bcrypt.genSalt(10);
    this.Password = await bcrypt.hash(this.Password, salt);
    next()
})

const User = mongoose.model('User', UserSchema)

export default User