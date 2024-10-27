import { Category, CategoryModel } from "../../models/category";
import { ApiResponse } from "../../dto/response/apiResponse";

export const addCategory = async (category: Category) => {
    let response: ApiResponse<any>;
    try {
        const name = category.name;
        const categoryExisted = await CategoryModel.findOne({name: name});
        if(categoryExisted) {
            console.log(categoryExisted);
            response = {
                statusCode: 400,
                message: 'Category already exist',
                data: null,
                error: "Bad request"
            }
            return response;
        } else {
            const newCategory = await CategoryModel.create(category);
            console.log("new Category");
            response = {
                statusCode: 201,
                message: 'Category created successfully',
                data: newCategory,
                error: null
            }
            return response;
        }
    } catch(error) {
        console.error('Error add new category', error);
        response = {
            statusCode: 500,
            message: 'Internal Server Error',
            data: null,
            error: error.message
        };
        return response;
    }
}