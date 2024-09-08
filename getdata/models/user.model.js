import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import validator from 'validator'

const UserSchema =mongoose.Schema({
    UserName: {
        type: String,
        required: true,
        unique:[true,'UserName already taken chhose another'],
        minlength: [5, 'UserName must be at least 5 characters long'],
        maxlength: [15, 'UserName must be at most 15 characters long'],
    },
    Name: {
        type: String,
        required: [true, 'Name is required'],
        minlength: [5, 'Name must be at least 5 characters long'],
        maxlength: [20, 'Name must be at most 20 characters long'],
    },

    Email: {
        type: String,
        required: true,
        unique : [true, 'Account already on this email'],
        validate : [validator.isEmail , 'Invalid email adress']
    },
    Country: {
        type: String,
        // required : true
    },
    Password : {
        type : String , 
        required : true ,
        minlength: [6, 'Password must be at least 6 characters long'],
        maxlength: [20, 'Password must be at most 20 characters long'],
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