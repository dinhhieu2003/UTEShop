import express from "express";
import * as adminController from "../../controllers/admin/adminController";
import { checkAuth } from "../../middlewares/auth";

const router = express.Router();

export default (): express.Router => {
    router.post("/users/statistics", checkAuth, adminController.getUserStatistics);
    router.get("/general-statistics", checkAuth, adminController.getGeneralStatistics);
    return router;
}