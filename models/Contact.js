const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: [true, 'Please include uid']
  },
  name: {
    type: String,
    required: [true, 'Please include a name']
  },
  title: String,
  employer: String,
  email: String,
  email2: String,
  phone: String,
  phone2: String,
  socialMedia: [],
  proSpecialty: String,
  interests: [],
  communications: [],
  notes: []
})

module.exports = mongoose.model('Contacts', ContactSchema);