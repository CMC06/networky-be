const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Task = require('../models/Task');

// @desc      Add a new task
// @route     POST /api/v1/tasks
// @access    Private
exports.addTask = asyncHandler( async (req, res, next) => {
  //create new task
  const newTask = await Task.create(req.body);

  res.status(201).json({
    success: true,
    data: newTask
  });
});

// @desc      Get user tasks
// @route     GET /api/v1/tasks/
// @access    Private
exports.getTasks = asyncHandler( async (req, res, next) => {
  console.log(req.body.uid);
  const tasks = await Task.find({ uid: req.body.uid })
  res.status(200).json({success: true, data: tasks});
});

// @desc      Update a task
// @route     PUT /api/v1/tasks/:id
// @access    Private
exports.updateTask = asyncHandler( async (req, res, next) => {
  const taskId = req.params.id;

  let updatedTask = await Task.findById(taskId);

  // Check to see if task with that ID exists
  if(!updatedTask) {
    return next( new ErrorResponse(`Task with id of ${taskId} not found.`, 404));
  }

  if(updatedTask.uid.toString() !== req.body.uid) {
    return next( new ErrorResponse(`User ${req.body.uid} is not authorized to update this task`, 403));
  }

  updatedTask = await Task.findByIdAndUpdate(taskId, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({success: true, data: updatedTask});
});

// @desc    Delete a task
// @route   DELETE /api/v1/tasks/:id
// @access  Private
exports.deleteTask = asyncHandler( async (req, res, next) => {
  const taskId = req.params.id;

  let task = await Task.findById(taskId);

  if(!task){
    return next( new ErrorResponse(`Task with id of ${taskId} not found.`, 404));
  }

  if(task.uid.toString() !== req.body.uid) {
    return next( new ErrorResponse(`User ${req.body.uid} is not authorized to delete this task.`, 403));
  }

  await Task.findByIdAndDelete(taskId);

  const tasks = await Task.find({ uid: req.body.uid });

  res.status(200).json({
    success: true,
    data: tasks
  })
})