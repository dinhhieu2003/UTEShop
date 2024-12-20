import { addToCart } from '../services/cart/cartService';
import { UserModel, IUser } from '../models/user';
import { ProductModel, Product } from '../models/product';
import mongoose from 'mongoose';
import { CategoryModel } from '../models/category';

const mockingoose = require("mockingoose");

const validUserId = '507f1f77bcf86cd799439011'; // Chuỗi hex hợp lệ dài 24 ký tự
const validProductId = '507f1f77bcf86cd799439012'; // Chuỗi hex hợp lệ
const validCategoryId = '507f1f77bcf86cd799439013';

const invalidUserId = '507f1f77bcf86cd799439011';
const invalidProductId = '507f1f77bcf86cd799439015'

  const mockCategory = new CategoryModel({
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439013'), // Chuỗi hex hợp lệ
    name: 'Electronics',
    isActivated: true,
    products: [
      new mongoose.Types.ObjectId('507f1f77bcf86cd799439012'), // Mock Product ID
      new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'), // Mock Product ID
    ],
  });
  
  // Mock Product theo schema
  const mockProduct: Product = new ProductModel({
    _id: new mongoose.Types.ObjectId(validProductId),
    categoryId: mockCategory._id,
    name: 'Test Product',
    description: 'This is a test product',
    price: 100,
    images: ['image1.jpg', 'image2.jpg'],
    stock: 10,
    isActivated: true,
    information: 'Test product information',
    reviews: [],
  });

  // Mock User theo schema
const mockUser: IUser = new UserModel({
    _id: new mongoose.Types.ObjectId(validUserId),
    fullName: 'Test User',
    email: 'testuser@example.com',
    password: 'hashedpassword',
    otp: '123456',
    address: { address: '123 Main St', city: 'City', country: 'Country', telephone: '01357' },
    isActivated: true,
    createdAt: new Date(),
    role: 'customer',
    cart: {
      products: [
        { product: mockProduct, quantity: 1 },
      ],
      totalPrice: 100,
    },
    orders: [],
  });

  describe('addToCart', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      mockingoose.resetAll;
    });
  
    it('should return 404 if user not found', async () => {
      mockingoose(UserModel).toReturn(null, 'findOne');
      const result = await addToCart(invalidUserId, { productId: validProductId, quantity: 1 });
      expect(result).toEqual({
        statusCode: 404,
        message: 'User not found',
        data: null,
        error: 'User not found',
      });
    });
  
    it('should return 404 if product not found', async () => {
      mockingoose(UserModel).toReturn(mockUser, 'findOne');
      mockingoose(ProductModel).toReturn(null, 'findOne');
      const result = await addToCart(validUserId, { productId: invalidProductId, quantity: 1 });
      expect(result).toEqual({
        statusCode: 404,
        message: 'Product not found',
        data: null,
        error: 'Product not found',
      });
    });
  
    it('should update quantity and total price if product exists in cart', async () => {
      mockingoose(UserModel).toReturn(mockUser, 'findOne');
      mockingoose(ProductModel).toReturn(mockProduct, 'findOne');
      const result = await addToCart(validUserId, { productId: validProductId, quantity: 1 });
      expect(result).toEqual({
        statusCode: 200,
        message: 'Product added to cart successfully',
        data: {
          products: [
            { product: mockProduct, quantity: 2 }, // Kiểm tra cập nhật quantity
          ],
          totalPrice: 200, // Kiểm tra cập nhật totalPrice
        },
        error: null,
      });
    });
  
    it('should add product to cart and update total price if product is not in cart', async () => {
      const userWithoutCart = {
        ...mockUser.toObject(),
        cart: { products: [] as any[], totalPrice: 0 },
      };
      mockingoose(UserModel).toReturn(userWithoutCart, 'findOne');
      mockingoose(ProductModel).toReturn(mockProduct, 'findOne');
      const result = await addToCart(validUserId, { productId: validProductId, quantity: 1 });
      expect(result).toEqual({
        statusCode: 200,
        message: 'Product added to cart successfully',
        data: {
          products: [{ product: mockProduct, quantity: 1 }],
          totalPrice: 100,
        },
        error: null,
      });
    });
  
    // it('should return 500 if ObjectId casting fails', async () => {
    //   const invalidProductIdFormat = '671e0b';
    //   try {
    //     await addToCart(invalidUserId, { productId: invalidProductIdFormat, quantity: 1 });
    //   } catch (error: any) {
    //     expect(error.message).toContain('Cast to ObjectId failed');
    //   }
    // });
  });
  