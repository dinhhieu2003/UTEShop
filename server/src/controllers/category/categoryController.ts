import express from "express";
import * as categoryService from "../../services/category/categoryService"
import mongoose from "mongoose";
import { Category } from "models/category";

export const updateCategory = async (request: express.Request, response: express.Response) => {
    try {
        const { categoryId } = request.params;
        const updatedCategory: Category = request.body.category;  
        const categoryResponse = await categoryService.updateCategory(categoryId, updatedCategory);
        response.json(categoryResponse);  
    } catch (error) {
        console.log(error);
        response.status(500).json({ error: error.message });
    }
};


export const deleteCategory = async (request: express.Request, response: express.Response) => {
    try {
        const { id } = request.params;
        const categoryResponse = await categoryService.deleteCategory(id);
        response.json(categoryResponse);
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: error.message });
    }
};

export const addCategory = async (request: express.Request, response: express.Response) => {
    try {
        const category: Category = request.body.category;
        const categoryResponse = await categoryService.addCategory(category);
        response.json(categoryResponse);
    } catch (error) {
        console.log(error);
        response.status(500).json({ error: error.message });
    }
}

export const getAllCategory = async (request: express.Request, response: express.Response) => {
    try {
        const categoryResponse = await categoryService.getAllCategory();
        response.json(categoryResponse);
    } catch (error) {
        console.log(error);
        response.status(500).json({ error: error.message });
    }
}