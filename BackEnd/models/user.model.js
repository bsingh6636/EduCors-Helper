import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import validator from 'validator';

const UserSchema = mongoose.Schema({
    UserName: {
        type: String,
        unique: [true, 'UserName already taken, choose another'],
        minlength: [5, 'UserName must be at least 5 characters long'],
        maxlength: [15, 'UserName must be at most 15 characters long'],
        validate: {
            validator: function(value) {
                return /^[a-zA-Z0-9]+$/.test(value); // Only alphanumeric characters
            },
            message: 'UserName can only contain alphanumeric characters'
        }
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
        unique: [true, 'Account already exists with this email'],
        validate: {
            validator: validator.isEmail,
            message: 'Invalid email address'
        },
        trim: true,
        lowercase: true
    },
    Country: {
        type: String,
    },
    Password: {
        type: String,
        required: true,
        minlength: [6, 'Password must be at least 6 characters long'],
        maxlength: [20, 'Password must be at most 20 characters long'],
        validate: {
            validator: function(value) {
                // Password must contain at least one uppercase letter, one number, etc.
                return /^(?=.*[A-Z])(?=.*[0-9])(?=.{6,20})/.test(value);
            },
            message: 'Password must contain at least one uppercase letter and one number'
        }
    },
    ApiKey: {
        type: String,
        unique: true,
        sparse: true,
        default: undefined
    },
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('Password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.Password = await bcrypt.hash(this.Password, salt);
    next();
});

const User = mongoose.model('User', UserSchema);

export default User;
