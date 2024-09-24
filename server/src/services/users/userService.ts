import { UserModel } from "../../models/user";
import { ApiResponse } from "../../dto/response/apiResponse";
import { AccountResponse } from "dto/response/auth/accountResponse";

export const getUserById = async (id: string) => {
    console.log(id);
    const user = await UserModel.findById(id);
    let response: ApiResponse<AccountResponse>;
    // convert user to AccountResponse
    if (!user) {
        response = {
            statusCode: 404,
            message: 'User not found',
            data: null,
            error: "Bad Request"
        }
        return response;
    }
    const accountResponse: AccountResponse = {
        email: user.email,
        fullName: user.fullName,
        address: user.address,
        role: user.role
    };
    response = {
        statusCode: 200,
        message: 'Fetch account success',
        data: accountResponse,
        error: null
    }
    console.log(user);
    return response;
}