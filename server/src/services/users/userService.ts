import { IUser, UserModel } from "../../models/user";
import { ApiResponse } from "../../dto/response/apiResponse";
import { AccountResponse } from "../../dto/response/auth/accountResponse";
import { BaseService } from "../baseService";

class UserService extends BaseService<IUser> {
    constructor() {
        super(UserModel);
    }
}

export const userService = new UserService();

export const getUserById = async (id: string) => {
    console.log(id);
    const userResponse = await userService.findById(id);
    let response: ApiResponse<AccountResponse>;
    // convert user to AccountResponse
    if (userResponse.statusCode === 404) {
        response = {
            statusCode: 404,
            message: 'User not found',
            data: null,
            error: "Bad Request"
        }
        return response;
    }
    const accountResponse: AccountResponse = {
        email: userResponse.data.email,
        fullName: userResponse.data.fullName,
        address: userResponse.data.address,
        role: userResponse.data.role
    };
    response = {
        statusCode: 200,
        message: 'Fetch account success',
        data: accountResponse,
        error: null
    }
    console.log(userResponse);
    return response;
}