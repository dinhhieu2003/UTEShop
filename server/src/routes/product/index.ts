import express from "express";
import { checkAuth } from "../../middlewares/auth";
import * as productController from "../../controllers/product/productController";
import upload from "../../middlewares/multer";

const router = express.Router();

export default (): express.Router => {
    router.get("", productController.getProducts);
    router.post("", checkAuth, upload.array("images", 10), productController.addProduct);
    router.get("/:productId", productController.getOneProduct);
    router.delete("/:id", checkAuth, productController.deleteProduct);
    router.put("/:id", checkAuth, productController.editProduct);
    return router;
}