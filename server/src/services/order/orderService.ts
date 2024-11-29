import { ICartItem } from "../../dto/response/types";
import { ApiResponse } from "../../dto/response/apiResponse";
import { UserModel } from "../../models/user";
import { ProductModel } from "../../models/product";
import mongoose from "mongoose";
import { OrderModel } from "../../models/order";

export const createOrder = async (userId: string, cartItems: ICartItem[], totalPrice: number) => {
    let response: ApiResponse<any>;

    try {
        const currentUser = await UserModel.findById(userId);
        if (!currentUser) {
            return {
                statusCode: 404,
                message: 'User not found',
                data: null,
                error: 'User not found',
            };
        }

        const products = [];

        for (const item of cartItems) {
            const product = await ProductModel.findById(item.id);
            if (!product) {
                return {
                    statusCode: 404,
                    message: `Product with id ${item.id} not found`,
                    data: null,
                    error: `Product with id ${item.id} not found`,
                };
            }

            // Kiểm tra stock
            if (product.stock < item.quantity) {
                return {
                    statusCode: 400,
                    message: `Insufficient stock for product ${product.name}`,
                    data: null,
                    error: `Insufficient stock for product ${product.name}`,
                };
            }

            // Trừ stock
            product.stock -= item.quantity;
            await product.save();

            products.push({
                productId: new mongoose.Types.ObjectId(item.id),
                quantity: item.quantity,
            });
        }

        const newOrder = new OrderModel({
            products: products,
            totalPrice: totalPrice,
            status: 'place order',
            createdAt: new Date(),
            userId: userId
        });

        await newOrder.save();

        currentUser.orders.push(newOrder.id);
        await currentUser.save();

        response = {
            statusCode: 201,
            message: 'Order created successfully',
            data: newOrder,
            error: null,
        };
    } catch (error) {
        console.error('Error creating order:', error);
        response = {
            statusCode: 500,
            message: 'Internal Server Error',
            data: null,
            error: error.message,
        };
    }

    return response;
};

export const getOrderItems = async (orderId: string) => {
    let response: ApiResponse<any>;

    try {
        const order = await OrderModel.findById(orderId).populate("products.productId");
        if (!order) {
            return {
                statusCode: 404,
                message: 'Order not found',
                data: null,
                error: 'Order not found'
            };
        }

        const orderItems = order.products.map((item: any) => {
            return {
                id: item._id,
                productId: item.productId._id,
                image: item.productId.images[0] || "",
                name: item.productId.name,
                quantity: item.quantity,
                price: item.productId.price,
            };
        });

        response = {
            statusCode: 200,
            message: 'Order items retrieved successfully',
            data: orderItems,
            error: null
        };

    } catch (error) {
        console.error('Error retrieving order items:', error);
        response = {
            statusCode: 500,
            message: 'Internal Server Error',
            data: null,
            error: error.message
        };
    }

    return response;
};

export const getOrderHistory = async (userId: string) => {
    let response: ApiResponse<any>;

    try {
        // Tìm kiếm user
        const currentUser = await UserModel.findById(userId).populate('orders').exec();
        if (!currentUser) {
            return {
                statusCode: 404,
                message: 'User not found',
                data: null,
                error: 'User not found',
            };
        }

        const orders = await OrderModel.find({ _id: { $in: currentUser.orders } })
            .populate({
                path: "products.productId", // Đường dẫn đến productId trong products
                model: "Product", // Model cần populate
                select: "images name price", // Chỉ chọn các field cần thiết để giảm băng thông
            })
            .exec();

        const orderHistory = orders.map(order => ({
            orderNumber: order._id.toString(),
            orderDate: order.createdAt.toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            }),
            totalAmount: `$${order.totalPrice.toFixed(2)}`,
            status: order.status,
            items: order.products.map((product: any) => ({
                image: product.productId?.images || [],
                name: product.productId?.name || "Unknown Product",
                price: (product.productId?.price || 0).toFixed(2) as number,
                quantity: product.quantity
            })),
        }));

        response = {
            statusCode: 200,
            message: 'Order history fetched successfully',
            data: orderHistory,
            error: null,
        };
    } catch (error) {
        console.error('Error fetching order history:', error);
        response = {
            statusCode: 500,
            message: 'Internal Server Error',
            data: null,
            error: error.message,
        };
    }

    return response;
};

export const getOrder = async (orderId: string) => {
    let response: ApiResponse<any>;

    try {
        const order = await OrderModel.findById(orderId)
            .populate({
                path: "products.productId", // Đường dẫn đến productId trong products
                model: "Product", // Model cần populate
                select: "images name price", // Chỉ chọn các field cần thiết để giảm băng thông
            })
            .exec()

        const orderResponse = {
            orderNumber: order._id.toString(),
            orderDate: order.createdAt.toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            }),
            totalAmount: `$${order.totalPrice.toFixed(2)}`,
            status: order.status,
            items: order.products.map((product: any) => ({
                image: product.productId?.images || [],
                name: product.productId?.name || "Unknown Product",
                price: (product.productId?.price || 0).toFixed(2) as number,
                quantity: product.quantity
            }))
        };

        response = {
            statusCode: 200,
            message: 'Order fetched successfully',
            data: orderResponse,
            error: null,
        };
    } catch (error) {
        console.error('Error fetching order :', error);
        response = {
            statusCode: 500,
            message: 'Internal Server Error',
            data: null,
            error: error.message,
        };
    }

    return response;
};

export const getAllOrders = async (): Promise<ApiResponse<any>> => {
    let response: ApiResponse<any>;

    try {
        // Truy vấn tất cả đơn hàng trong cơ sở dữ liệu
        const orders = await OrderModel.find().populate('products.productId')
        .sort({ createdAt: -1 })    
        .exec();

        if (!orders || orders.length === 0) {
            return {
                statusCode: 404,
                message: 'No orders found',
                data: null,
                error: 'No orders found',
            };
        }

        const orderHistory = orders.map(order => ({
            orderNumber: order._id.toString(),
            orderDate: order.createdAt.toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            }),
            totalAmount: `$${order.totalPrice.toFixed(2)}`,
            status: order.status,
            items: order.products.map((product: any) => ({
                image: product.productId?.images || [],
                name: product.productId?.name || "Unknown Product",
                price: (product.productId?.price || 0).toFixed(2) as number,
                quantity: product.quantity
            }))
        }));

        response = {
            statusCode: 200,
            message: 'Orders fetched successfully',
            data: orderHistory,
            error: null,
        };
    } catch (error) {
        console.error('Error fetching orders:', error);
        response = {
            statusCode: 500,
            message: 'Internal Server Error',
            data: null,
            error: error.message,
        };
    }

    return response;
};

export const changeOrderStaus = async (orderId: string, status: string) => {
    let response: ApiResponse<any>

    try {
        const order = await OrderModel.findById(orderId).exec()

        order.status = status
        order.save()

        response = {
            statusCode: 200,
            message: 'Order changed successfully',
            data: null,
            error: null,
        };
    } catch (error) {
        console.error('Error changing order :', error);
        response = {
            statusCode: 500,
            message: 'Internal Server Error',
            data: null,
            error: error.message,
        };
    }

    return response;
};

export const getQuarterlyRevenueStatistics = async () => {
    const deliveredOrders = await OrderModel.find({ status: "delivered" })
    const quarterlyRevenue = [0, 0, 0, 0]

    deliveredOrders.forEach((order) => {
        const month = order.createdAt.getMonth()
        const quater = Math.floor(month / 3) // Tính quý: 0: Q1 - 1: Q2 - 2: Q3 - 3: Q4
        quarterlyRevenue[quater] += order.totalPrice
    })

    const response: ApiResponse<any> = {
        statusCode: 200,
        message: 'Fetch Revenue successfully',
        data: quarterlyRevenue,
        error: null,
    }

    return response
}