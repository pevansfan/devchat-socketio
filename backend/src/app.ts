import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'

import roomRouter from './routes/rooms.routes';
import authRouter from './routes/auth.routes'

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/rooms', roomRouter);
app.use("/api/auth", authRouter);

export { app };