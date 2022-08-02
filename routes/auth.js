const express = require('express');
const {
  createNewUser
} = require('../controllers/auth');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.route('/newUser').post(createNewUser);

module.exports = router;