import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
  {
    UserName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 20,
      match: /^[a-z0-9_]+$/,
    },
    Name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    Email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    Country: { type: String, default: '', maxlength: 80 },
    Password: { type: String, required: true, select: false },
    ApiKey: { type: String, unique: true, sparse: true },
  },
  { timestamps: true },
);

UserSchema.pre('save', async function () {
  if (this.isModified('Password'))
    this.Password = await bcrypt.hash(this.Password, 12);
});
export default mongoose.models.User || mongoose.model('User', UserSchema);
