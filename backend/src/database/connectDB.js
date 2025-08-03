const mongoose = require('mongoose');

const connectDB = async () => {
   try{
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
    console.log(`MongoDB connected: ${connectionInstance.connection.host}`);
   } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit the process with failure
}
}
module.exports = { connectDB };
// This function connects to a MongoDB database using Mongoose