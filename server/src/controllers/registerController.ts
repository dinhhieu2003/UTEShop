import { registerUser, verifyOTP } from "../services/registerService"
import express, {Request, Response} from "express"


export const postRegister = async (req: Request, res: Response) => {
  const {fullName, email, password} = req.body

  try {
    await registerUser(fullName, email, password)
    res.status(200).json({ message: "OTP sent to email" })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const postActiveAccount = async (req: Request, res: Response) => {
  const {email, otp} = req.body

  try {
    await verifyOTP(email, otp)
    res.status(200).json({ message: "Account verified" })
  } catch (error) {
    res.status(400).json({ message: error.message }) 
  }
}