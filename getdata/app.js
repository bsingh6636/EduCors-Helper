import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { forwardUrl, VerifyApiKey } from './forward.controller.js';

const app = express();


app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));


app.use(cookieParser());
app.use(express.json());
app.use('/api/getData/health', (req, res) => {
    res.status(200).json({ status: 'success' });
})
app.use('/api/getData', VerifyApiKey, forwardUrl);

export default app;
