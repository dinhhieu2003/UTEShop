import { IAddress, IUser, UserModel } from "../../models/user";
import { ApiResponse } from "../../dto/response/apiResponse";
import { AccountResponse } from "../../dto/response/auth/accountResponse";
import { BaseService } from "../baseService";

class UserService extends BaseService<IUser> {
    constructor() {
        super(UserModel);
    }
}

export const userService = new UserService();
export const getAllUsers = async () => {
    const usersResponse = await userService.findAll();
    let response: ApiResponse<AccountResponse[]>;

    if (usersResponse.statusCode === 404) {
        response = {
            statusCode: 404,
            message: 'No users found',
            data: [],
            error: "Bad Request"
        };
        return response;
    }

    // Convert user list to AccountResponse array
    const accountResponses: AccountResponse[] = usersResponse.data.map((user: any) => ({
        email: user.email,
        fullName: user.fullName,
        address: user.address,
        role: user.role
    }));

    response = {
        statusCode: 200,
        message: 'Fetch all users success',
        data: accountResponses,
        error: null
    };

    return response;
};


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
    return response;
}

export const getAddress = async (userId: string) => {
    const userResponse = await userService.findById(userId);
    let response: ApiResponse<IAddress>;

    if (userResponse.statusCode === 404) {
        response = {
            statusCode: 404,
            message: 'User not found',
            data: null,
            error: "Bad Request"
        }
        return response;
    }

    const addressResponse: IAddress = userResponse.data.address;
    response = {
        statusCode: 200,
        message: 'Fetch address success',
        data: addressResponse,
        error: null
    }
    console.log(addressResponse);
    return response;
}

export const updateUser = async (user: IUser) => {
    let response: ApiResponse<IUser>;

    try {
        const existingUser = await UserModel.findOne({ email: user.email });
        if (!existingUser) {
            return {
                statusCode: 404,
                message: 'User not found',
                data: null,
                error: 'User not found'
            };
        }

        existingUser.fullName = user.fullName || existingUser.fullName;
        existingUser.email = user.email || existingUser.email;
        existingUser.address = user.address || existingUser.address;
        existingUser.isActivated = user.isActivated ?? existingUser.isActivated;
        existingUser.role = user.role || existingUser.role;

        const updatedUser = await existingUser.save();

        response = {
            statusCode: 200,
            message: 'User updated successfully',
            data: updatedUser,
            error: null
        };
    } catch (error) {
        console.error('Error updating user:', error);
        response = {
            statusCode: 500,
            message: 'Internal Server Error',
            data: null,
            error: error.message
        };
    }

    return response;
};