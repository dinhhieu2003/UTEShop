import express from "express";
import * as loginController from "../../controllers/auth/loginController";
import * as registerController from "../../controllers/auth/registerController";
import * as resetpwController from "../../controllers/auth/resetpwController";

const router = express.Router();

export default (): express.Router => {
    router.post("/login", loginController.login);
    router.post('/register', registerController.postRegister);
    router.post('/verify-otp', registerController.postActiveAccount);
    router.post('/forgot-password', resetpwController.forgotPassword);
    router.post('/reset-password', resetpwController.resetPasswordController);
    
    return router;
}
