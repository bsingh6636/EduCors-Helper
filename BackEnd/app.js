import express from 'express';
import userRouter from './router/user.router.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { DEVELOPMENT_MODE, FRONTENDURL } from './envHelper.js';

const app = express();

// const corsOptions = {
//     origin: (origin, callback) => {
//         if (DEVELOPMENT_MODE === 'LOCAL') {
//             console.log(DEVELOPMENT_MODE);
//             callback(null, FRONTENDURL);
//         } else {
//             callback(null, '*');
//         }
//     },
//     credentials: true,
//     methods: ['GET', 'POST', 'PATCH', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
// };

app.use(cors(
    {
        origin: '*',
        credentials: true,
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }
))

// app.use(cors(corsOptions));

// Handles preflight requests for all routes
// app.options('*', cors(corsOptions));

app.use(cookieParser());
app.use(express.json());

app.use('/api', userRouter);

export default app;
