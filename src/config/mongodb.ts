import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectMongoDB = async () => {
  // Only connect if MONGO_URI is explicitly set
  if (!process.env.MONGO_URI) {
    console.log('⚠️  MongoDB URI not provided, skipping MongoDB connection');
    return;
  }
  try {
    const mongoURI =
      process.env.MONGO_URI || 'mongodb://localhost:27017/unite_mongo';

    await mongoose.connect(mongoURI); // No options needed for Mongoose 6+

    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};

export default connectMongoDB;
