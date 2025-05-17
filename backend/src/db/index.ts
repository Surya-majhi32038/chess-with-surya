import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/chess`);
    console.log(`MongoDB connected at host: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${(error as Error).message}`);
    process.exit(1);
  }
};

export default connectDB;


/**
 * import mongoose, { Connection } from 'mongoose';
import { DB_NAME } from '../constant';

const connectDB = async (): Promise<void> => {
  try {
    const connectionInstance: Connection = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(`MongoDB connected at host: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${(error as Error).message}`);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;

 * 
 */