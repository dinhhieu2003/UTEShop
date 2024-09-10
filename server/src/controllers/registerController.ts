import { registerUser, verifyOtp } from "../services/registerService"
import express, {Request, Response} from "express"


export const postRegister = async (req: Request, res: Response) => {
    const {fullName, email, password} = req.body
    console.log(req.body)

    try {
        await registerUser(fullName, email, password);
        res.status(200).json({ message: "OTP sent to email" });
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
}
