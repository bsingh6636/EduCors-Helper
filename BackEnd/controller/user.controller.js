import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'node:crypto';
import User from '../models/user.model.js';
import { deletePartobject } from '../helper/deletePartobject.js';
import { validateSignup } from '../helper/validateInput.js';
import { cookieOptions, SESSION_DAYS, getJwtSecret } from '../envHelper.js';

const newKey = () => 'ec_' + randomBytes(24).toString('hex');
export const API_KEY_PATTERN = /^ec_[a-f0-9]{48}$/;
// A cost-12 hash of a random value, compared for unknown users so sign-in time doesn't reveal which accounts exist.
const TIMING_HASH =
  '$2b$12$U.dcaOHgE/Egn7XsP2XuWeyfpBAZzLgcZstHbq09xy8HJSXGVCRki';
function startSession(res, user, status = 200) {
  const token = jwt.sign({ id: String(user._id) }, getJwtSecret(), {
    expiresIn: SESSION_DAYS + 'd',
    algorithm: 'HS256',
  });
  res.cookie('userToken', token, {
    ...cookieOptions,
    maxAge: SESSION_DAYS * 86400000,
  });
  return res
    .status(status)
    .json({ success: true, data: deletePartobject(user) });
}
export async function userSign(req, res) {
  const { UserNameorEmail, Password } = req.body || {};
  if (
    typeof UserNameorEmail !== 'string' ||
    typeof Password !== 'string' ||
    !UserNameorEmail.trim() ||
    !Password
  ) {
    return res.status(400).json({
      success: false,
      message: 'Username or email and password are required.',
    });
  }
  const input = UserNameorEmail.trim().toLowerCase();
  const user = await User.findOne({
    $or: [{ UserName: input }, { Email: input }],
  }).select('+Password');
  const matches = await bcrypt.compare(
    Password,
    user?.Password || TIMING_HASH,
  );
  if (!user || !matches) {
    return res.status(401).json({
      success: false,
      message: 'The username/email or password is incorrect.',
    });
  }
  return startSession(res, user);
}
export async function userSignUp(req, res) {
  const error = validateSignup(req.body);
  if (error) return res.status(400).json({ success: false, message: error });
  getJwtSecret();
  const { UserName, Name, Email, Password, Country } = req.body;
  try {
    const user = await User.create({
      UserName: UserName.trim().toLowerCase(),
      Name: Name.trim(),
      Email: Email.trim().toLowerCase(),
      Password,
      Country: Country?.trim() || '',
      ApiKey: newKey(),
    });
    return startSession(res, user, 201);
  } catch (error) {
    if (error.code === 11000)
      return res.status(409).json({
        success: false,
        message: 'That username or email is already in use.',
      });
    throw error;
  }
}
export function userLogOut(req, res) {
  res.clearCookie('userToken', cookieOptions);
  return res.json({ success: true });
}
export async function regenerateApiKey(req, res) {
  const key = newKey();
  await User.updateOne({ _id: req.user._id }, { $set: { ApiKey: key } });
  return res.json({ success: true, data: key });
}
export async function validateApiKey(req, res) {
  const key = req.get('x-api-key');
  if (!key)
    return res
      .status(400)
      .json({ success: false, valid: false, message: 'API key is required.' });
  const user =
    API_KEY_PATTERN.test(key) &&
    (await User.findOne({ ApiKey: key }).select('_id'));
  return res
    .status(user ? 200 : 401)
    .json({ success: Boolean(user), valid: Boolean(user) });
}
