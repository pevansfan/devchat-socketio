import type { UserResponse } from "./user-response";

export interface CurrentUserResponse {
    user: UserResponse;
    roomId: string;
    status: string;
}