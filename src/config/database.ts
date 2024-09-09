import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const DATABASE_HOST = process.env.DATABASE_HOST;
const DATABASE_PORT = process.env.DATABASE_PORT;
const DATABASE_NAME = process.env.DATABASE_NAME;

const MONGODB_URI = `mongodb://${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}`;

export async function connectMongoose(): Promise<void> {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('DATABASE WAS CONNECTED SUCCESFULLY ✅');
  } catch (err) {
    console.log('DATABASE WAS NOT CONNECTED SUCCESFULLY 🛑');
    throw(err);
  }
}