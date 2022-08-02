const express = require('express');
const {
  getCompanies,
  addCompany,
  updateCompany,
  deleteCompany
} = require('../controllers/companies');

const Company = require('../models/Company');

const router = express.Router();

const advancedResults = require('../middleware/advancedResults');

router.route('/')
  .get(getCompanies)
  .post(addCompany)

router.route('/:id')
  .put(updateCompany)
  .delete(deleteCompany)

module.exports = router;