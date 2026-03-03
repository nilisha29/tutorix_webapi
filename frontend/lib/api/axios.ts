import axios from 'axios';
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL 
    || 'http://localhost:5050';

const axiosInstance = axios.create(
    {
        baseURL: BASE_URL,
        headers: {
            'Content-Type': 'application/json',
        }
    }
);


axiosInstance.interceptors.request.use(
    async (config) => {
        let token: string | null = null;

        if (typeof window !== "undefined") {
            const authTokenCookie = document.cookie
                .split(";")
                .map((cookie) => cookie.trim())
                .find((cookie) => cookie.startsWith("auth_token="));

            token = authTokenCookie ? decodeURIComponent(authTokenCookie.split("=")[1] || "") : null;
        }

        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


export default axiosInstance;