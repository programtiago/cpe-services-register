import { UserRole } from "./enum/userRole";

export interface User {
    id: number,
    workerno: number,
    password?: string,
    token?: string,
    userRole: UserRole
}