import express from 'express'
import {  generateApiKey, userLogOut, userSign, userSignUp } from '../controller/user.controller.js'
import { Auth } from '../middelware/auth.js'
import {  getApiUsage } from '../controller/forward.controller.js'


const router = express.Router()

router.post('/signIn',userSign)
router.post('/signUp',userSignUp)
router.get('/auth', Auth)
router.post('/genApiKey' , generateApiKey)
// router.use('/getData' , VerifyApiKey,forwardUrl)
// router.post('/getData' , forwardUrl)
router.get('/signOut', userLogOut)
router.post('/apiUsage', getApiUsage)
export default router ;