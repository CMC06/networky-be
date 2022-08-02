const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Please add task text']
  },
  priority: {
    type: Boolean,
    required: [true, 'Please set priority']
  },
  uid: {
    type: String,
    required: [true, 'Include associated user ID']
  },
  completed: {
    type: Boolean,
    required: [true, 'Indicated completed status']
  }
});

module.exports = mongoose.model('Task', TaskSchema);