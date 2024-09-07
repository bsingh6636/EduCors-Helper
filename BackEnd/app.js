import express from 'express'
import userRouter from './router/user.router.js'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import { DEVELOPMENT_MODE, FRONTENDURL } from './envHelper.js';

const app = express()

const corsOtions = {
    origin: (origin, callback) => {
        if (DEVELOPMENT_MODE === 'LOCAL') {
            console.log(DEVELOPMENT_MODE)
            callback(null, FRONTENDURL);
        } else {
            console.log(DEVELOPMENT_MODE);
            callback(null, '*')
        }
    },
    credentials: true,
    methods: ['GET', 'POST', ' PATCH', 'DELETE'],
    allowedHeaders: ['Contenet-Type', 'Authorization']
}
app.use(cors(corsOtions));

app.options('*',cors(corsOtions))




app.use(cookieParser())

app.use(express.json())

app.use('/api', userRouter)

// app.use('/api/getData', cors({ origin: '*' , credentials: true, methods: [ 'POST' ] }))

export default app;