import mongoose from "mongoose";

const connectDB = async () => {
   try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("MONGO_URI is not defined. Please set it in your environment variables.");
    }

    await mongoose.connect(mongoUri);
    console.log('mongodb connected successfully');
   } catch (error) {
    console.error('MongoDB connection error:', error.message);
    throw error;
   }
}
export default connectDB;