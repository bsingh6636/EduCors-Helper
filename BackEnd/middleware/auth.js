import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { deletePartobject } from '../helper/deletePartobject.js';
import { getJwtSecret } from '../envHelper.js';
import { connectDatabase } from '../database.js';

export async function Auth(req, res, next) {
  const token =
    req.cookies?.userToken ||
    (req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.slice(7)
      : null);
  if (!token)
    return res
      .status(401)
      .json({ success: false, message: 'Sign in to access your account.' });
  let decoded;
  try {
    decoded = jwt.verify(token, getJwtSecret(), { algorithms: ['HS256'] });
  } catch {
    return res.status(401).json({
      success: false,
      message: 'Your session expired. Please sign in again.',
    });
  }
  try {
    await connectDatabase();
    const user = await User.findById(decoded.id);
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: 'Your session is no longer valid.' });
    req.user = deletePartobject(user);
    next();
  } catch (error) {
    next(error);
  }
}
