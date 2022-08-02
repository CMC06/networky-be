const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

// Configure environment variables
dotenv.config({ path: './config/config.env' });

// load models
const User = require('./models/User');
const Task = require('./models/Task');
const { ConnectionCreatedEvent } = require('mongodb');

// connect to database
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// read JSON files
const users = JSON.parse(fs.readFile(`${__dirname}/_testData/users.json`, 'utf-8'));
const tasks = JSON.parse(fs.readFile(`${__dirname}/_testData/tasks.json`, 'utf-8'));
//const contacts = JSON.parse(fs.readFile(`${__dirname}/_testData/contacts.json`, 'utf-8'));
// const companies = JSON.parse(fs.readFile(`${__dirname}/_testData/companies.json`, 'utf-8'));

// import into database
const importTestData = async () => {
  try {
    await User.create(users);
    await Task.create(tasks);
    //await Contact.create(contacts);
    //await Company.create(companies);

    console.log('Test Data Imported...'.green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
}

// delete ALL data from database (use in DEV only)
const deleteAllData = async () => {
  try {
    await User.deleteMany();
    await Test.deleteMany();
    //await Contact.deleteMany();
    //await Company.deleteMany();

    console.log('All data deleted from database...'.red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
}

if(process.argv[2] === '-i') {
  importTestData();
} else if (process.argv[2] === '-d') {
  deleteAllData();
}
