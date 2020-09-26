import {API_CONFIG} from "../config/apiConfig";
import {post} from "../utils";

export async function login(username, password) {
    const response = await post(API_CONFIG.endpoints.LOGIN, {
        username,
        password
    });
    const user = response.data;
    localStorage.setItem("token", user.token);
    localStorage.setItem("username", user.username);
    return {
        token: user.token,
        username: user.username
    }
}