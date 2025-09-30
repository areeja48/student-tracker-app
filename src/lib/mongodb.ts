import mongoose from 'mongoose';

const connectDb = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  const db = await mongoose.connect(process.env.MONGODB_URI!);
  console.log("MongoDB connected");
  return db;
};

export default connectDb;