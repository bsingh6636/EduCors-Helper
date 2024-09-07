import express from 'express'
import userRouter from './router/user.router.js'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import { FRONTENDURL } from './envHelper.js';

const app = express()

app.use(cors({
    origin: FRONTENDURL,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE']
}));


app.use(cookieParser())

app.use(express.json())

app.use('/api', userRouter)

app.use('/api/getData', cors({ origin: '*' , credentials: true, methods: [ 'POST' ] }))

export default app;