const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please fill a valid email address',
      ],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
    },
    role: {
      type: String,
      enum: ['admin', 'member'],
      default: 'member',
    },
  },
  { timestamps: true }
);

// Never store plain-text password 
userSchema.virtual('password').set(function (plainText) {
  if (plainText) {
    const salt = bcrypt.genSaltSync(10);
    this.passwordHash = bcrypt.hashSync(plainText, salt);
  }
});

// Instance method to compare a login attempt against the stored hash
userSchema.methods.comparePassword = function (plainText) {
  return bcrypt.compareSync(plainText, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);