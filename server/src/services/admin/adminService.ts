import { OrderModel } from "../../models/order"
import { ApiResponse } from "../../dto/response/apiResponse"
import { UserModel } from "../../models/user"

export const getUserStatistics = async (currentYear: number) => {
    const users = await UserModel.find({
        createdAt: {
            $gte: new Date(`${currentYear}-01-01`), // Ngày đầu năm
            $lt: new Date(`${currentYear + 1}-01-01`), // Ngày đầu năm tiếp theo
        }
    })

    const totalUsers: number[] = Array(12).fill(0)
    const newUsers: number[] = Array(12).fill(0)

    users.forEach((user) => {
        const month = user.createdAt.getMonth() // 0: thang 1 - 1: thang 2 - ....11: thang 12
        newUsers[month]++

        // Cộng dồn vào tổng số lượng người dùng đến tháng đó
        for (let i=month; i<12; i++) {
            totalUsers[i]++
        }
    })

    const data = {
        totalUsers: totalUsers,
        newUsers: newUsers
    }
    
    const response: ApiResponse<any> = {
        statusCode: 200,
        message: 'Fetch Users Statistics successfully',
        data: data,
        error: null,
    }

    return response
}

export const getGeneralStatistics = async () => {
    const orders = await OrderModel.find({ status: "delivered" })

    const successOrders = orders.length
    let totalIncomes = 0
    orders.forEach((order) => {
        totalIncomes += order.totalPrice
    })

    const users = await UserModel.find()
    const totalUsers = users.length

    const data = {
        totalIncomes: totalIncomes,
        totalUsers: totalUsers,
        successOrders: successOrders
    }

    const response: ApiResponse<any> = {
        statusCode: 200,
        message: 'Fetch General Statistics successfully',
        data: data,
        error: null,
    }

    return response
}