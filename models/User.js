const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  uid: {
    type: String,
    required: [true, 'Please add uid'],
    unique: true
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email address']
  },
  role: {
    type: String,
    enum: ['user'],
    default: 'user'
  },
  // Using Firebase for login / auth
  // Would only need to implement following code block if not using Firebase
  //
  // password: {
  //   type: String,
  //   required: [true, 'Please add a password'],
  //   minlength: 8,
  //   select: false
  // },
  // resetPasswordToken: String,
  // resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Not using this, implementing firebase for auth
// Encrypt password using bcrypt
// UserSchema.pre('save', async function (next) {
//   // Keep this from running in case of forgot password
//   if(!this.isModified('password')){
//     next();
//   }
//   const salt = await bcrypt.getSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this.uid}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE})
}

// Following blocks not used since implementing firebase auth
//
// // Match user entered password to hashed password in db
// UserSchema.methods.matchPassword = async function (passwordEntered) {
//   return await bcrypt.compare(passwordEntered, this.password);
// }

// // Generate and hash password token
// UserSchema.methods.getResetPasswordToken = function () {
//   // Generate token
//   const resetToken = crypto.randomBytes(20).toString('hex');

//   // Hash token and set to resetPasswordToken field
//   this.resetPasswordToken = crypto
//     .createHash('sha256')
//     .update(resetToken)
//     .digest('hex');
  
//   // Set expire
//   this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

//   return resetToken
// }

// Reverse populate with virtuals from tasks, network contacts, and companies
UserSchema.virtual('tasks', {
  ref: 'Task',
  localField: 'uid',
  foreignField: 'user',
  justOne: false
});

// If a user is deleted, we want to delete all associated data from other models
UserSchema.pre('remove', async function (next){
  await this.model('Task').deleteMany({ user: this.uid });
  next();
});

module.exports = mongoose.model('User', UserSchema);