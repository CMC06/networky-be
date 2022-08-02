const express = require('express');
const {
  addTask,
  getTasks,
  updateTask,
  deleteTask
} = require('../controllers/tasks');

const Task = require('../models/Task');

const router = express.Router();

const advancedResults = require('../middleware/advancedResults');

router.route('/')
  .post(addTask)
  .get(getTasks)

router.route('/:id')
  .put(updateTask)
  .delete(deleteTask)

module.exports = router;