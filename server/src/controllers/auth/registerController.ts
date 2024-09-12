import { ApiResponse } from "dto/response/apiResponse"
import { registerUser, verifyOTP } from "../../services/auth/registerService"
import express, {Request, Response} from "express"


export const postRegister = async (req: Request, res: Response) => {
  const {fullName, email, password} = req.body
  let response: ApiResponse

  try {
    const registerResponse = await registerUser(fullName, email, password)
    res.json(registerResponse)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const postActiveAccount = async (req: Request, res: Response) => {
  const {email, otp} = req.body

  try {
    const activeResponse = await verifyOTP(email, otp)
    res.json(activeResponse)
  } catch (error) {
    res.status(500).json({ message: error.message }) 
  }
}