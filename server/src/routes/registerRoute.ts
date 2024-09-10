import express, {Request, Response} from "express"
import {postRegister, postActiveAccount} from "../controllers/registerController"

const router = express.Router()

router.post('/register', postRegister)
router.post('/verify-otp', postActiveAccount)

export default router