import axios from "axios";

const apiClient = axios.create({
    baseURL: "https://localhost:7234",
    withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes("/login") &&
            !originalRequest.url?.includes("/refresh-token")
        ) {
            originalRequest._retry = true;

            const storedRefreshToken = localStorage.getItem("refreshToken");

            if (!storedRefreshToken) {
                localStorage.removeItem("token");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("role");
                localStorage.removeItem("name");
                localStorage.removeItem("email");
                localStorage.removeItem("mustChangePassword");
                window.location.href = "/login";
                return Promise.reject(error);
            }

            try {
                const refreshResponse = await axios.post(
                    "https://localhost:7234/api/users/User/refresh-token",
                    {
                        refreshToken: storedRefreshToken,
                    }
                );

                const {
                    token,
                    refreshToken,
                    role,
                    name,
                    email,
                    mustChangePassword,
                } = refreshResponse.data;

                localStorage.setItem("token", token);
                localStorage.setItem("refreshToken", refreshToken);
                localStorage.setItem("role", role);
                localStorage.setItem("name", name);
                localStorage.setItem("email", email);
                localStorage.setItem("mustChangePassword", String(mustChangePassword));

                originalRequest.headers.Authorization = `Bearer ${token}`;

                return apiClient(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem("token");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("role");
                localStorage.removeItem("name");
                localStorage.removeItem("email");
                localStorage.removeItem("mustChangePassword");
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;