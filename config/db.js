const mongoose = require('mongoose');

const connectDB = async () => {
  //store connection in conn variable
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  console.log(`MongoDB Connected ${conn.connection.host}`.cyan.bold)
}

module.exports = connectDB;