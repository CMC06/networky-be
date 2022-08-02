const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Contacts = require('../models/Contact');

// @desc      Gets all contacts related to a user
// @route     GET /api/v1/companies
// @access    Private
exports.getContacts = asyncHandler( async (req, res, next) => {
  const uid = req.body.uid;

  const contacts = await Contacts.find({uid: uid});

  if(!contacts){
    return next( new ErrorResponse(`No contacts found.`, 401));
  }

  res.status(200).json({
    success: true,
    count: contacts.length,
    data: contacts
  });
});

// @desc      Adds a new contact to DB
// @route     POST /api/v1/contacts
// @access    Private
exports.addContact = asyncHandler( async (req, res, next) => {
  const newContact = await Contacts.create(req.body);

  if(!newContact){
    return next(new ErrorResponse('Contact not created', 400));
  }

  res.status(201).json({
    success: true,
    msg: 'New contact created',
    data: newContact
  });
});

// @desc      Update a contact
// @route     PUT /api/v1/contacts/:id
// @access    Private
exports.updateContact = asyncHandler( async (req, res, next) => {
  const contactId = req.params.id;

  const contact = await Contacts.findById(contactId);

  if(!contact){
    return next( new ErrorResponse(`No contact with id ${contactId} found`, 400));
  }

  if(contact.uid.toString() !== req.body.uid){
    return next( new ErrorResponse('User is not authorized to update the requested contact', 403))
  }

  const updatedContact = await Contacts.findByIdAndUpdate(contactId, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: updatedContact
  });
});

// @desc      Delete a contact
// @route     DELETE /api/v1/contacts/:id
// @access    Private
exports.deleteContact = asyncHandler( async (req, res, next) => {
  const contactId = req.params.id;

  const contact = await Contacts.findById(contactId);

  if(!contact){
    return next( new ErrorResponse(`No contact with id ${contactId} found`, 400));
  }

  if(contact.uid.toString() !== req.body.uid){
    return next( new ErrorResponse('User not authorized to delete contact', 403));
  }

  await Contacts.findByIdAndDelete(contactId);

  const contacts = await Contacts.find({uid: req.body.uid});

  res.status(200).json({
    success: true,
    msg: `Contact ${contactId} deleted`,
    data: contacts
  });
});