import dotenv from 'dotenv';
import mongoose from 'mongoose';

const DATABASE_HOST = process.env.DATABASE_HOST;
const DATABASE_PORT = process.env.DATABASE_PORT;
const DATABASE_NAME = process.env.DATABASE_NAME;

let MONGODB_URI: string;
if (DATABASE_PORT == '' || DATABASE_PORT == undefined) {
  MONGODB_URI = `mongodb+srv://${DATABASE_HOST}`
} else {
  MONGODB_URI = `mongodb://${DATABASE_HOST}:${DATABASE_PORT}`
}

export async function connectMongoose(): Promise<void> {
  try {
    await mongoose.connect(MONGODB_URI, { dbName: DATABASE_NAME });
    console.log('DATABASE WAS CONNECTED SUCCESFULLY ✅');
  } catch (err) {
    console.log('DATABASE WAS NOT CONNECTED SUCCESFULLY 🛑');
    throw (err);
  }
}