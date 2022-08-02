const ErrorResponse = require('../utils/errorResponse');
const firebaseConfig = require('../config/firebaseConfig');
const firebaseAdmin = require('firebase-admin');
const serviceAccount = require('../config/fbServiceAccountKey.json');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

// Initialize firebase app to use auth 
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// @desc      Create new user
// @route     POST /api/v1/auth/newUser
// @access    Public
exports.createNewUser = asyncHandler( async(req, res, next) => {
  // Destructure user info from request
  const { uid, name, email } = req.body;
  // Create new user entry in database
  const newUser = await User.create({
    uid,
    email,
    name
  });

  sendTokenResponse(newUser, 200, res);
});



// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  //Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true
  };

  if(process.env.NODE_ENV === 'production'){
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token
    });
}