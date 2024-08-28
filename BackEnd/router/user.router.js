import express from 'express'
import {  generateApiKey, userSign, userSignUp } from '../controller/user.controller.js'
import { Auth } from '../middelware/auth.js'
import { forwardUrl } from '../controller/forward.controller.js'

const router = express.Router()

router.post('/signIn',userSign)
router.post('/signUp',userSignUp)
router.post('/auth', forwardUrl)
router.post('/genApiKey' , generateApiKey)

export default router ;