import express from 'express'
import userRouter from './router/user.router.js'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import { DEVELOPMENT_MODE, FRONTENDURL } from './envHelper.js';

const app = express()


if(DEVELOPMENT_MODE=='LOCAL'){
    app.use(cors({
    origin: FRONTENDURL,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE']
}));
}else{
    app.use(cors({
        origin: '*',
        credentials: true,
        methods: ['GET', 'POST', 'PATCH', 'DELETE']
    }));
}




app.use(cookieParser())

app.use(express.json())

app.use('/api', userRouter)

// app.use('/api/getData', cors({ origin: '*' , credentials: true, methods: [ 'POST' ] }))

export default app;