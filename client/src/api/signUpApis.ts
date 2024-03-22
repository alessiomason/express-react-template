import {apiUrl} from "./apisValues";
import {handleApiError} from "./handleApiError";

async function signUp(
    email: string | undefined,
    name: string | undefined,
    surname: string | undefined,
    username: string | undefined,
    password: string
) {
    const body = JSON.stringify({
        email: email === "" ? undefined : email,
        name: name === "" ? undefined : name,
        surname: surname === "" ? undefined : surname,
        username: username === "" ? undefined : username,
        password: password
    });

    const response = await fetch(new URL("signup", apiUrl), {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: body
    });
    if (response.ok) {
        return true;
    } else await handleApiError(response);
}

async function updatePassword(oldPassword: string, newPassword: string) {
    const body = {
        oldPassword: oldPassword,
        newPassword: newPassword
    }

    const response = await fetch(new URL("password", apiUrl), {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(body),
    });
    if (response.ok) {
        return true;
    } else await handleApiError(response);
}

const signUpApis = {signUp, updatePassword};
export default signUpApis;