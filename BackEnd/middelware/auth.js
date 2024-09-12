
import jwt from 'jsonwebtoken'
import User from '../models/user.model.js';
import { deletePartobject } from '../helper/deletePartobject.js';

export const Auth = async (req, res, next) => {
    const token = req.cookies.userToken;
    if (!token) return res.status(400).json('no token found');
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        let user = await User.findById(decoded.id)
        if (!user) return res.status(402).json({ success: false, message: 'Invalid token' })
        user = deletePartobject(user)
        console.log(user)
        res.status(200).json({ success: true, message: ' Token verified', data: user });
        next;

    } catch (error) {
        return res.status(400).json({ success: false, message: error.name })
    }
}