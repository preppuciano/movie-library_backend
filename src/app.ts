import express from 'express';
import movieRoutes from './routes/movieRoutes';
import dotenv from 'dotenv';
import cors from 'cors';
import errorHandler from './middlewares/errorHandler';
import path from 'path';

const API_VERSION = process.env.API_VERSION;
const NODE_ENV = process.env.NODE_ENV;

const app = express();

app.use(cors());
app.use(express.json());

if (NODE_ENV == "production") {
  app.use('/public', express.static(path.join(__dirname, 'public')));
} else {
  app.use('/public', express.static(path.join(__dirname, '../public')));
}

app.use(`/api/${API_VERSION}`, movieRoutes);

// Middleware de manejo de errores
app.use(errorHandler);

export default app;