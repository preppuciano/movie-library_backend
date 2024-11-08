import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '../.env') });

import app from './app';
import { connectMongoose } from './config/database';

const SERVER_HOST = process.env.SERVER_HOST || 'localhost';
const SERVER_PORT = parseInt(process.env.SERVER_PORT || '3000');

const SERVER_URI = `${SERVER_HOST}:${SERVER_PORT}`;

async function startServer(): Promise<void> {
  try {
    await connectMongoose();
    app.listen(SERVER_PORT, SERVER_HOST, () => {
      console.log('SERVER IS RUNNING ON:', SERVER_URI, '✅');
    }).on('error', (err: NodeJS.ErrnoException) => {
      console.error('Error starting the server:', err.message);
      // Opcional: Terminar el proceso si el error es crítico
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${SERVER_PORT} is already in use`);
      }
    });
  } catch (err) {
    console.error('🛑:', err);
    process.exit(1);
  }
}

startServer();