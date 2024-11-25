import express from "express";
import * as productService from "../../services/product/productService"
import mongoose from "mongoose";
import { ApiResponse } from "dto/response/apiResponse";
import { IGetOneProduct, IGetProduct } from "dto/response/types";
import { broadcast } from "../../services/notification/notification";
import { UserModel } from "../../models/user";
import { sendEmail } from "../../utils/sendEmail";

export const editProduct = async (request: express.Request, response: express.Response) => {
    try {
        const { id } = request.params; 
        const updatedProduct = request.body; 
        const productResponse = await productService.editProduct(id, updatedProduct);

        response.json(productResponse);
    } catch (error) {
        console.error('Error in editProduct controller:', error);
        response.status(500).json({ error: error.message });
    }
};

export const deleteProduct = async (request: express.Request, response: express.Response) => {
    try {
        const { id } = request.params;
        const productResponse = await productService.deleteProduct(id);
        response.json(productResponse);
    } catch (error) {
        console.error('Error in deleteProduct controller:', error);
        response.status(500).json({ error: error.message });
    }
};

export const addProduct = async (request: express.Request, response: express.Response) => {
    try {
        const product = request.body;
        const productResponse = await productService.addProduct(product);
        if(productResponse.statusCode == 201) {
            const productName = productResponse.data.name;
            broadcast(null, {
                type: "NEW PRODUCT",
                payload: `Vừa có một sản phẩm mới tên: ${productName}`,
            });
            const users = await UserModel.find({ role: "customer" });
            users.forEach(async (user) => {
                await sendEmail(user.email, "NEW PRODUCT !!", "", `Vừa có sản phẩm mới tên ${productResponse.data.name}`);
            });
        }
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

export const getOneProduct = async (request: express.Request, response: express.Response) => {
    try {
        const { productId } = request.params;
        let productResponse: ApiResponse<IGetOneProduct>;
        productResponse = await productService.getProductById(productId)
        response.json(productResponse);
    } catch (error) {
        console.log(error);
        response.status(500).json({ error: error.message });
    }
}