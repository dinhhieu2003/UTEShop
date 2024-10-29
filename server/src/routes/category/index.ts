import express from "express";
import { checkAuth } from "../../middlewares/auth";
import * as categoryController from "../../controllers/category/categoryController";

const router = express.Router();

export default (): express.Router => {
    router.post("", checkAuth, categoryController.addCategory);
    router.get("", categoryController.getAllCategory)
    return router;
}