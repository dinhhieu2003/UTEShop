import { Product, ProductModel } from "../../models/product";
import { ApiResponse } from "../../dto/response/apiResponse";
import { CategoryModel } from "../../models/category";
import mongoose from "mongoose";
import cloudinary from "../../configs/cloudinary";
import { IGetOneProduct, IGetProduct } from "../../dto/response/types";
import * as productMapper from "../../mapper/productMapper"

export const editProduct = async (productId: string, updatedProduct: Partial<Product>) => {
    let response: ApiResponse<any>;
    try {
        const existingProduct = await ProductModel.findById(productId);
        if (!existingProduct) {
            response = {
                statusCode: 404,
                message: 'Product not found',
                data: null,
                error: 'Not Found'
            };
            return response;
        }

        Object.assign(existingProduct, updatedProduct);
        const savedProduct = await existingProduct.save();

        response = {
            statusCode: 200,
            message: 'Product updated successfully',
            data: savedProduct,
            error: null
        };
        return response;
    } catch (error) {
        console.error('Error updating product:', error);
        response = {
            statusCode: 500,
            message: 'Internal Server Error',
            data: null,
            error: error.message
        };
    }
    return response;
};

export const deleteProduct = async (productId: string) => {
    let response: ApiResponse<any>;
    try {
        const deletedProduct = await ProductModel.findByIdAndDelete(productId);
        if (!deletedProduct) {
            response = {
                statusCode: 404,
                message: 'Product not found',
                data: null,
                error: 'Not Found'
            };
            return response;
        }
        response = {
            statusCode: 200,
            message: 'Product deleted successfully',
            data: deletedProduct,
            error: null
        };
        return response;
    } catch (error) {
        console.error('Error deleting product:', error);
        response = {
            statusCode: 500,
            message: 'Internal Server Error',
            data: null,
            error: error.message
        };
    }
    return response;
};

export const addProduct = async(product: Product, imagePaths: string[]) => {
    let response: ApiResponse<any>;

    try {
        const { name, categoryId } = product;

        // 1. Kiểm tra nếu sản phẩm đã tồn tại
        const existedProduct = await ProductModel.findOne({ name, categoryId });
        if (existedProduct) {
            response = {
                statusCode: 400,
                message: 'Product already exists',
                data: null,
                error: 'Bad request',
            };
            return response;
        }

        // 2. Tạo sản phẩm mới
        const newProduct = await ProductModel.create(product);

        // 3. Nếu có ảnh, tải lên Cloudinary
        let imageUrls: string[] = [];
        if (imagePaths && imagePaths.length > 0) {
            const uploadPromises = imagePaths.map((imagePath) =>
                cloudinary.uploader.upload(imagePath, {
                    folder: 'products',
                    resource_type: 'image',
                    quality: 'auto',
                    format: 'jpg',
                })
            );
            const uploadResults = await Promise.all(uploadPromises);
            imageUrls = uploadResults.map((result) => result.secure_url);
        }

        // 4. Cập nhật các liên kết ảnh vào sản phẩm
        if (imageUrls.length > 0) {
            newProduct.images = imageUrls; // Nếu bạn có trường `images` trong schema
            await newProduct.save();
        }

        // 5. Trả về phản hồi thành công
        response = {
            statusCode: 201,
            message: 'Product created successfully with images',
            data: newProduct,
            error: null,
        };
        return response;

    } catch (error: any) {
        console.error('Error adding product with images:', error);

        response = {
            statusCode: 500,
            message: 'Internal Server Error',
            data: null,
            error: error.message || 'Unknown error',
        };
        return response;
    }
}

export const getProductsByCategoryName = async (categoryName: string) => {
    let response: ApiResponse<IGetProduct[]>
    try {
        const products: Product[] = await ProductModel.find().populate({
            path: 'categoryId',
            match: {name: categoryName},
        })
        .exec();
        const filteredProducts = products.filter((product) => product.categoryId !== null);
        if(filteredProducts.length == 0) {
            response = {
                statusCode: 404,
                message: 'Not found products',
                data: null,
                error: "Not found"
            }
        } else {
            const productsResponse:IGetProduct[] = await productMapper.mapProductsToIGetProducts(filteredProducts);
            response = {
                statusCode: 200,
                message: "Get products by category name success",
                data: productsResponse,
                error: null
            }
        }
        return response;

    } catch(error) {
        console.error('Error get products', error);
        response = {
            statusCode: 500,
            message: 'Internal Server Error',
            data: null,
            error: error.message
        };
        return response;
    }
}

export const getAllProducts = async () => {
    let response: ApiResponse<IGetProduct[]>;
    try {
        const products: Product[] = await ProductModel.find().populate({
            path: 'categoryId',
        });
        if(products.length == 0) {
            response = {
                statusCode: 404,
                message: 'Not found products',
                data: null,
                error: "Not found"
            }
        } else {
            const productsResponse:IGetProduct[] = await productMapper.mapProductsToIGetProducts(products);
            response = {
                statusCode: 200,
                message: "Get products success",
                data: productsResponse,
                error: null
            }
        }
        return response;
    } catch(error) {
        console.error('Error get products', error);
        response = {
            statusCode: 500,
            message: 'Internal Server Error',
            data: null,
            error: error.message
        };
        return response;
    }
}

export const getProductById = async (productId: string) => {
    let response: ApiResponse<IGetOneProduct>
    try {
        const product: Product = await ProductModel.findOne({ _id: productId }).populate({
            path: 'categoryId',
        })
        .exec();
        if(!product) {
            response = {
                statusCode: 404,
                message: 'Not found product',
                data: null,
                error: "Not found"
            }
        } else {
            const productsResponse:IGetOneProduct = await productMapper.mapProductsToIGetOneProduct(product);
            response = {
                statusCode: 200,
                message: "Get product ok",
                data: productsResponse,
                error: null
            }
        }
        return response;

    } catch(error) {
        console.error('Error get product', error);
        response = {
            statusCode: 500,
            message: 'Internal Server Error',
            data: null,
            error: error.message
        };
        return response;
    }
}