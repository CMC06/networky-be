const express = require('express');
const {
  getContacts,
  addContact,
  updateContact,
  deleteContact
} = require('../controllers/contacts');

const Contacts = require('../models/Contact');

const router = express.Router();

const advancedResults = require('../middleware/advancedResults');

router.route('/')
  .get(getContacts)
  .post(addContact)

router.route('/:id')
  .put(updateContact)
  .delete(deleteContact)

module.exports = router;