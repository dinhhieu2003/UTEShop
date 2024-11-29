import express from "express"
import * as adminService from "../../services/admin/adminService"

export const getUserStatistics = async (request: express.Request, response: express.Response) => {
    try {
        const {currentYear} = request.body
        const Response = await adminService.getUserStatistics(currentYear)
        response.json(Response);
    } catch (error) {
        console.log(error)
        response.status(500).json({ error: error.message })
    }
}

export const getGeneralStatistics = async (request: express.Request, response: express.Response) => {
    try {
        const Response = await adminService.getGeneralStatistics()
        response.json(Response);
    } catch (error) {
        console.log(error)
        response.status(500).json({ error: error.message })
    }
}

export const getOrderDetails = async (request: express.Request, response: express.Response) => {
    try {
        const {orderId} = request.params
        const Response = await adminService.getOrderDetails(orderId)
        response.json(Response);
    } catch (error) {
        console.log(error)
        response.status(500).json({ error: error.message })
    }
}