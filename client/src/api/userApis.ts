import {apiUrl} from "./apisValues";
import {User} from "../models/user";
import {handleApiError} from "./handleApiError";

async function getAllUsers() {
    const response = await fetch(new URL("users", apiUrl), {
        method: "GET",
        credentials: "include",
        headers: {
            "Accept": "application/json"
        }
    });
    if (response.ok) {
        return await response.json();
    } else await handleApiError(response);
}

async function getUser(userId: number) {
    const response = await fetch(new URL(`users/${userId}`, apiUrl), {
        method: "GET",
        credentials: "include",
        headers: {
            "Accept": "application/json"
        }
    });
    if (response.ok) {
        return await response.json();
    } else await handleApiError(response);
}

async function verifyUsernameUniqueness(username: string) {
    const response = await fetch(new URL(`users/username/${username}`, apiUrl), {
        method: "GET",
        credentials: "include",
        headers: {
            "Accept": "application/json"
        }
    });

    return response.ok;
}

async function updateUser(user: User) {
    const response = await fetch(new URL("users", apiUrl), {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(user),
    });
    if (response.ok) {
        return true;
    } else await handleApiError(response);
}

const userApis = {getAllUsers, getUser, verifyUsernameUniqueness, updateUser};
export default userApis;