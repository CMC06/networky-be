const path = require('path');
const express = require('express');
const dotenv = require('dotenv')

//Load env vars
dotenv.config({ path: './config/config.env' });
const cors = require('cors');

//Bring in resource routes 
const auth = require('./routes/auth');
const tasks = require('./routes/tasks');
const contacts = require('./routes/contacts');
const companies = require('./routes/companies');

const colors = require('colors');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/error')

// connect to database
connectDB();

// initialize express app
const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Sanitize data before hitting DB
app.use(mongoSanitize());
// Set security headers
app.use(helmet());
// Prevent XSS attacks
app.use(xss());
//Limit rate of requests from single IP address
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100
});
app.use(limiter)
//Prevent http param pollution
app.use(hpp());

// ensure app uses cors
app.use(cors());

// Mount routers
app.use('/api/v1/auth', auth);
app.use('/api/v1/tasks', tasks);
app.use('/api/v1/contacts', contacts);
app.use('/api/v1/companies', companies);

// Initialize errorHandler
app.use(errorHandler);

// landing page get
app.get('/', (req, res) => {
  res.send('Welcome to Networky Backend');
})

const port = process.env.PORT || 5000;
app.listen(port);
console.log(`Running on port: ${port}`);