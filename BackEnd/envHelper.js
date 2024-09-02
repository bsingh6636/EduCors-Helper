import { config } from 'dotenv'

config({ path: './config.env' })

export const FRONTENDURL=process.env.FRONTEND_PORT;