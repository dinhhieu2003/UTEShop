import express from "express";
import * as authMiddle from "../../middlewares/auth";
import * as userController from "../../controllers/user/userController";

const router = express.Router();

export default (): express.Router => {
    router.get("", authMiddle.checkAuth, userController.getAddress);
    router.get('/users', authMiddle.checkAuth, userController.getAllUsers);
    router.put("", authMiddle.checkAuth, userController.updateUser);
    return router;
}
