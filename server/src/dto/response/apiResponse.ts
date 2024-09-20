export interface ApiResponse<T> {
    error?: string | string[];
    message: string | string[];
    statusCode: number | string;
    data?: T;
}