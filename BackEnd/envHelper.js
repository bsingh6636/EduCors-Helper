import { config } from 'dotenv'

config({ path: './config.env' })

export const DEVELOPMENT_MODE = process.env.DEVELOPMENT_MODE ;

export const FRONTENDURL=process.env.FRONTEND_PORT;