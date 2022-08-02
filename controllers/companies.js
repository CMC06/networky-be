const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Company = require('../models/Company');
const User = require('../models/User');
const { json } = require('express/lib/response');

// @desc      Get all user's companies
// @route     GET /api/v1/companies
// @access    Private
exports.getCompanies = asyncHandler( async (req, res, next) => {
  const companies = await Company.find({uid: req.body.uid});

  res.status(200).json({
    success: true,
    count: companies.length,
    data: companies
  })
})

// @desc      Adds a new company to DB
// @route     POST /api/v1/companies
// @access    Private
exports.addCompany = asyncHandler( async (req, res, next) => {
  const newCompany = await Company.create(req.body);

  if(!newCompany){
    return next( new ErrorResponse(`Company not created`, 400))
  }
  
  res.status(201).json({success: true, msg: 'New company added', data: newCompany});
});

// @desc      Update a company by id
// @route     PUT /api/v1/companies/:id
// @access    Private
exports.updateCompany = asyncHandler( async (req, res, next) => {
  const companyId = req.params.id;

  const company = await Company.findById(companyId);

  if(!company){
    return next(new ErrorResponse(`No company with id of ${companyId} found`, 404));
  }

  if(company.uid.toString() !== req.body.uid) {
    return next(new ErrorResponse(`User ${req.body.uid} is not authorized to update this company`, 403));
  }

  updatedCompany = await Company.findByIdAndUpdate(companyId, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: updatedCompany
  })
});

// @desc      Delete a company by id
// @route     DELETE /api/v1/companies/:id
// @access    Private
exports.deleteCompany = asyncHandler( async(req, res, next) => {
  //make sure person requesting delete is the one with authorization for entry
  const companyId = req.params.id;
  const company = await Company.findById(companyId);

  if(!company){
    return next( new ErrorResponse(`No company with id of ${companyId} found`, 404));
  }

  if(company.uid.toString() !== req.body.uid){
    return next(new ErrorResponse(`User not authorized to delete designated company`, 403));
  }

  await Company.findByIdAndDelete(companyId);

  const companies = await Company.find({uid: req.body.uid});

  res.status(200).json({
    success: true,
    count: companies.length,
    msg: `Company with id of ${companyId} deleted.`,
    data: companies
  });
});