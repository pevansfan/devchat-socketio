import type { UserResponse } from "@/types/user-response";

const API_URL = "http://localhost:3000/api";

export interface InitializeConnectionRequest {
    username: string;
    roomId: string;
}

export interface InitializeConnectionResponse {
    user: UserResponse;
}

export interface CurrentUserResponse {
    user: UserResponse;
    roomId: string;
    status: string;
}

export const initializeConnection = async ({
    username,
    roomId,
}: {
    username: string;
    roomId: string;
}) => {
    const response = await fetch(`${API_URL}/auth/initialize`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
            username,
            roomId,
        }),
    });

    const data = await response.json();

    console.log("initialize:", response.status, data);

    if (!response.ok) {
        throw new Error(
            data.message || "Une erreur est survenue",
        );
    }

    return data;
};

export const getCurrentUser = async (): Promise<CurrentUserResponse> => {
    const response = await fetch(`${API_URL}/auth/me`, {
        method: "GET",
        credentials: "include",
    });

    if (!response.ok) {
        const error = await response.json().catch(() => null);

        throw new Error(
            error?.message || "Failed to get current user",
        );
    }

    return response.json();
};