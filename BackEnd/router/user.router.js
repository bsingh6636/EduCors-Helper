import express from 'express'
import {  generateApiKey, userLogOut, userSign, userSignUp } from '../controller/user.controller.js'
import { Auth } from '../middelware/auth.js'
import { forwardUrl, VerifyApiKey } from '../controller/forward.controller.js'

const router = express.Router()

router.post('/signIn',userSign)
router.post('/signUp',userSignUp)
router.get('/auth', Auth)
router.post('/genApiKey' , generateApiKey)
router.post('/getData' , VerifyApiKey,forwardUrl)
router.get('/signOut', userLogOut)

export default router ;