

import { setToken, setApiToken } from "@/utils/storage";
import { aesEncrypt } from "./crypto";
import { apiRequest } from "@/services/apirequest";

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

    try {
        const response = await apiRequest("post", "/users/login", encryptedPayload);
        const resData = response.data;

        if (resData?.header?.code !== 200) {
            throw new Error(resData?.header?.message || "Something went wrong");
        }

        const data = resData.response;

        if (response.headers?.["authorization"]) {
            setToken(response.headers["authorization"]);
        }
        if (data?.token) {
            setApiToken(data.token);
        }
        return data;
    }
    catch (err: any) {
        throw err; 
    }
};
