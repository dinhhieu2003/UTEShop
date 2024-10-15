import { Model, Document, Types, RootFilterQuery } from 'mongoose';
import { ApiResponse } from '../dto/response/apiResponse'; // Assuming ApiResponse is in a separate file

export class BaseService<T extends Document> {
    private model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    // Create a new document
    async create(data: Partial<T>): Promise<ApiResponse<T>> {
        try {
            const document = new this.model(data);
            const savedDocument = await document.save();
            return {
                message: "Document created successfully",
                statusCode: 201,
                data: savedDocument
            };
        } catch (error) {
            return {
                error: error.message,
                message: "Error creating document",
                statusCode: 500
            };
        }
    }

    // Find a document by ID
    async findById(id: string | Types.ObjectId): Promise<ApiResponse<T | null>> {
        try {
            const document = await this.model.findById(id);
            if (!document) {
                return {
                    message: "Document not found",
                    statusCode: 404,
                    data: null
                };
            }
            return {
                message: "Document found",
                statusCode: 200,
                data: document
            };
        } catch (error) {
            return {
                error: error.message,
                message: "Error finding document",
                statusCode: 500
            };
        }
    }

    // Find all documents with optional filter and pagination
    async findAll(filter: Partial<T> = {}, limit = 10, skip = 0): Promise<ApiResponse<T[]>> {
        try {
            const documents = await this.model.find(filter as RootFilterQuery<T>).limit(limit).skip(skip);
            return {
                message: "Documents found",
                statusCode: 200,
                data: documents
            };
        } catch (error) {
            return {
                error: error.message,
                message: "Error finding documents",
                statusCode: 500
            };
        }
    }

    // Update a document by ID
    async updateById(id: string | Types.ObjectId, data: Partial<T>): Promise<ApiResponse<T | null>> {
        try {
            const updatedDocument = await this.model.findByIdAndUpdate(id, data, { new: true });
            if (!updatedDocument) {
                return {
                    message: "Document not found",
                    statusCode: 404,
                    data: null
                };
            }
            return {
                message: "Document updated successfully",
                statusCode: 200,
                data: updatedDocument
            };
        } catch (error) {
            return {
                error: error.message,
                message: "Error updating document",
                statusCode: 500
            };
        }
    }

    // Delete a document by ID
    async deleteById(id: string | Types.ObjectId): Promise<ApiResponse<T | null>> {
        try {
            const deletedDocument = await this.model.findByIdAndDelete(id);
            if (!deletedDocument) {
                return {
                    message: "Document not found",
                    statusCode: 404,
                    data: null
                };
            }
            return {
                message: "Document deleted successfully",
                statusCode: 200,
                data: deletedDocument
            };
        } catch (error) {
            return {
                error: error.message,
                message: "Error deleting document",
                statusCode: 500
            };
        }
    }

    // Count documents by filter 
    async count(filter: Partial<T> = {}): Promise<ApiResponse<number>> {
        try {
            const count = await this.model.countDocuments(filter as RootFilterQuery<T>);
            return {
                message: "Count retrieved successfully",
                statusCode: 200,
                data: count
            };
        } catch (error) {
            return {
                error: error.message,
                message: "Error counting documents",
                statusCode: 500
            };
        }
    }
}
