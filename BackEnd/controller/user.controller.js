import bcrypt from 'bcrypt'
import User from "../models/user.model.js"
import { asyncErrorHandler } from "../utils/asyncErrorHandler.js";
import jwt from 'jsonwebtoken'
import { deletePartobject } from '../helper/deletePartobject.js';
import crypto from 'crypto'


export const userSign = asyncErrorHandler(async (req, res) => {
    let { UserNameorEmail, Password } = req.body;
    UserNameorEmail = UserNameorEmail.toLowerCase()

    try {
        let user = await User.findOne({
            $or: [
                { UserName: UserNameorEmail },
                { Email: UserNameorEmail }
            ]
        });

        if (!user) return res.status(400).json({ success: false, message: "User not found, try signing up." });


        const checkPassword = await bcrypt.compare(Password, user.Password)
        if (!checkPassword) return res.status(400).json({ success: false, message: "Incorrect Password try again." });
        const payload = { id: user.id }
        user = deletePartobject(user)
        const expiresIn = parseInt(process.env.COOKIE_EXPIRES, 10) * 24 * 60 * 60;

        // Generate token
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn });

        res.cookie('userToken', token, { httpOnly: true, secure: true, sameSite: 'strict' })
        return res.status(200).json({ success: 'true', message: "Logging In", data: user })
    } catch (error) {
        console.error(error)
        return res.status(400).json({ success: false, message: "Failed try again" });
    }
})

export const userSignUp = asyncErrorHandler(async (req, res) => {
    let { UserName, Password, Name, Email, Country } = req.body;
    console.log(Email, Name, Password)
    if (!Password || !Name || !Email) {
        return res.status(400).json({ success: false, message: "All fields are required." });
    }
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ Email });

        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists with this Email " });
        }


        let user = await User.create({
            Password, Name, Email, Country
        })
        const payload = { id: user.id }
        user = deletePartobject(user)
        const expiresIn = parseInt(process.env.COOKIE_EXPIRES, 10) * 24 * 60 * 60;

        // Generate token
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn });

        res.cookie('userToken', token, { httpOnly: true, secure: true, sameSite: 'strict' })

        user = deletePartobject(user)
        return res.status(201).json({ success: true, message: "User created successfully", data: user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message, error });
    }
});

export const userLogOut = asyncErrorHandler(async (req, res, next) => {
    try {
        res.clearCookie('userToken')
        return res.status(200).json({ success: true, message: 'Logged out Sucessfully' })
    } catch (error) {
        return res.status(400).json({ success: false, message: 'Logged out failed', error })
    }
})

export const generateApiKey = asyncErrorHandler(async (req, res, next) => {
    const { UserName } = req.body;
    console.log(UserName)

    if (!UserName) return res.status(400).json({ success: false, error: 'userName is required' });


    try {
        const user = await User.findOne({ UserName });
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });

        if (user.ApiKey) {
            return res.json({ success: true, message: 'API key already exists', data: user.ApiKey });
        }

        const ApiKey = crypto.randomBytes(8).toString('hex');

        const updatedUser = await User.findOneAndUpdate(
            { UserName },
            { ApiKey },
            { new: true, runValidators: true }
        );

        return res.json({ success: true, message: 'Api Key Generated', data: updatedUser.ApiKey });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Failed to generate API key' });
    }
});



