import express from "express";
import { checkAuth } from "../../middlewares/auth";
import * as productController from "../../controllers/product/productController";
import upload from "../../middlewares/multer";

const router = express.Router();

export default (): express.Router => {
    router.get("", productController.getProducts);
    router.post("", checkAuth, productController.addProduct);
    router.post("/:productId/images", upload.array("images", 10), productController.addImagesToProduct);
    return router;
}