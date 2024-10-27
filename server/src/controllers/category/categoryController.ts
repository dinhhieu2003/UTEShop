import express from "express";
import * as categoryService from "../../services/category/categoryService"
import mongoose from "mongoose";
import { Category } from "models/category";

export const addCategory = async (request: express.Request, response: express.Response) => {
    try {
        const category: Category = request.body;
        const categoryResponse = await categoryService.addCategory(category);
        response.json(categoryResponse);
    } catch (error) {
        console.log(error);
        response.status(500).json({ error: error.message });
    }
}