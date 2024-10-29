import express from "express";
import * as productService from "../../services/product/productService"
import mongoose from "mongoose";
import { ApiResponse } from "dto/response/apiResponse";
import { IGetProduct } from "dto/response/types";

export const addProduct = async (request: express.Request, response: express.Response) => {
    try {
        const product = request.body;
        const productResponse = await productService.addProduct(product);
        response.json(productResponse);
    } catch (error) {
        console.log(error);
        response.status(500).json({ error: error.message });
    }
}

export const addImagesToProduct = async (req: express.Request, res: express.Response) => {
    try {
        const { productId } = req.params;
        if (!req.files || !Array.isArray(req.files)) {
            return res.status(400).json({
                message: 'No images uploaded',
                error: 'Bad Request',
            });
        }

        const imagePaths = (req.files as Express.Multer.File[]).map(file => file.path);
        const response: any = await productService.addImagesToProduct(new mongoose.Types.ObjectId(productId), imagePaths);
        return res.status(response.statusCode).json({
            message: response.message,
            data: response.data,
            error: response.error,
        });
    } catch (error: any) {
        console.error('Error in addImagesToProduct controller:', error);
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message,
        });
    }
}

export const getProducts = async (request: express.Request, response: express.Response) => {
    try {
        let categoryName: string | undefined = request.query.categoryName as string;
        let productsResponse: ApiResponse<IGetProduct[]>;
        if(categoryName) {
            categoryName = categoryName.split("-").join(" ");
            productsResponse = await productService.getProductsByCategoryName(categoryName);
        } else {
            productsResponse = await productService.getAllProducts();
        }
        response.json(productsResponse);
    } catch (error) {
        console.log(error);
        response.status(500).json({ error: error.message });
    }
}