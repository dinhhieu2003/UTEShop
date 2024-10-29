import { Product, ProductModel } from "../../models/product";
import { ApiResponse } from "../../dto/response/apiResponse";
import { CategoryModel } from "../../models/category";
import mongoose from "mongoose";
import cloudinary from "../../configs/cloudinary";
import { IGetProduct } from "../../dto/response/types";
import * as productMapper from "../../mapper/productMapper"

export const addProduct = async(product: Product) => {
    let response: ApiResponse<any>;
    try {
        const name: string = product.name;
        const categoryId = product.categoryId;
        const existedProduct = await ProductModel.findOne({name, categoryId});
        if(existedProduct) {
            response = {
                statusCode: 400,
                message: 'Product already exist',
                data: null,
                error: "Bad request"
            }
            return response;
        }
        const newProduct = await ProductModel.create(product);
        response = {
            statusCode: 201,
            message: 'Product created successfully',
            data: newProduct,
            error: null
        }
        return response;
    } catch (error) {
        console.error('Error add new product', error);
        response = {
            statusCode: 500,
            message: 'Internal Server Error',
            data: null,
            error: error.message
        };
    }
    return response;
}

export const addImagesToProduct = async (productId: mongoose.Types.ObjectId, imagePaths: string[]) => {
    let response: ApiResponse<any>;

    // Kiểm tra nếu không có imagePaths
    if (!imagePaths || imagePaths.length === 0) {
        return {
            statusCode: 400,
            message: 'No images provided',
            data: null,
            error: 'Bad Request'
        };
    }

    try {
        // Upload các ảnh lên Cloudinary
        const uploadPromises = imagePaths.map((imagePath) =>
            cloudinary.uploader.upload(imagePath, {
                folder: 'products',
                resource_type: 'image', // Loại file
                quality: 'auto', // Tùy chọn chất lượng
                format: 'jpg', // Chuyển đổi định dạng file
            })
        );
        
        const uploadResults = await Promise.all(uploadPromises);
        const imageUrls = uploadResults.map(result => result.secure_url);

        // Cập nhật sản phẩm trong MongoDB
        const updatedProduct = await ProductModel.findByIdAndUpdate(
            productId,
            { $push: { images: { $each: imageUrls } } },
            { new: true }
        );

        // Kiểm tra nếu không tìm thấy sản phẩm
        if (!updatedProduct) {
            response = {
                statusCode: 404,
                message: 'Product not found',
                data: null,
                error: 'Not Found'
            };
            return response;
        }

        // Thành công
        response = {
            statusCode: 200,
            message: 'Images added successfully to product',
            data: updatedProduct,
            error: null
        };
        return response;

    } catch (error: any) {
        console.error('Error adding images to product:', error);

        // Xử lý lỗi cụ thể hơn nếu cần
        response = {
            statusCode: 500,
            message: 'Internal Server Error',
            data: null,
            error: error.message || 'Unknown error'
        };
        return response;
    }
};

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