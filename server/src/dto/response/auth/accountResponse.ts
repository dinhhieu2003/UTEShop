import { IAddress } from "models/user";

export interface AccountResponse {
    email: string;
    fullName: string;
    address: IAddress;
    role: string;
}