import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

// User Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 3,
      maxlength: 50,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      // obfuscate the email
      get: (email) => {
        const separatorIndex = email.indexOf('@');
        if (separatorIndex < 3) {
          // 'ab@gmail.com' -> '*****@gmail.com'
          return email.slice(0, separatorIndex).replace(/./g, '*') + '*'.repeat(3) + email.slice(separatorIndex);
        }
        // 'test42@gmail.com' -> 'te*******@gmail.com'
        return email.slice(0, 2) + email.slice(2, separatorIndex).replace(/./g, '*') + '*'.repeat(3) + email.slice(separatorIndex);
      },
    },
    password: {
      type: String,
      trim: true,
      required: true,
      // obfuscate the password
      get: () => '*'.repeat(Math.random() * (60 - 15) + 15),
    },
    role: {
      type: String,
      enum: ['ADMIN', 'CUSTOMER'],
      trim: true,
      uppercase: true,
      requied: true,
      default: 'CUSTOMER',
    },
  },
  { timestamps: true, toJSON: { getters: true } }
);

// Adding validation for the unique constraints
userSchema.plugin(uniqueValidator);

export default mongoose.model('User', userSchema, 'users');
