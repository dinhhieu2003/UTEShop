export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: {
        email: string;
        fullName: string;
        address: string;
        role: string;
    }
}