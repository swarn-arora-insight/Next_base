

import { setToken, setApiToken } from "@/utils/storage";
import { aesEncrypt } from "./crypto";
import { apiRequest } from "@/services/apirequest";
console.log("🔥 apiRequest imported");

interface LoginPayload {
    email: string;
    password: string;
}

export const loginApi = async (payload: LoginPayload) => {
    // Encrypt credentials before sending
    const encryptedPayload = {
        email: aesEncrypt(payload.email),
        password: aesEncrypt(payload.password),
    };

    console.log("Encrypted payload:", encryptedPayload);

    try {
        const response = await apiRequest("post", "/users/login", encryptedPayload);
        console.log("Response received:", response);

        const resData = response.data;
        console.log("LOGIN API RESPONSE:", resData);

        if (resData?.header?.code !== 200) {
            throw new Error(resData?.header?.message || "Something went wrong");
        }

        const data = resData.response;
        console.log("Login API data:", response.headers);
        console.log("Authorization header:", response.headers?.["Authorization"]);

        if (response.headers?.["authorization"]) {
            console.log("Saving token from headers:", response.headers["authorization"]);
            setToken(response.headers["authorization"]);
        }
        console.log("Login response data:", data);
        if (data?.token) {
            console.log("Saving API token from body:", data.token);
            setApiToken(data.token);
        }

        return data;
    } catch (err: any) {
        console.error("Login API error:", err.response || err.message || err);
        throw err; // re-throw if you want calling code to handle it
    }
};
