import axios from "axios";
import apiClient from "@/services/apiClient";

const API_BASE_USER = "https://localhost:7234/api/users/User";
const API_BASE_DRIVING_CENTER_APPLICATION =
    "https://localhost:7234/api/drivingcenter-applications";

export const loginUser = async (email: string, password: string) => {
    const response = await apiClient.post(`${API_BASE_USER}/login`, {
        userEmail: email,
        userPassword: password,
    });

    return response.data;
};

export const registerUser = async (
    name: string,
    email: string,
    password: string
) => {
    const response = await apiClient.post(`${API_BASE_USER}/register`, {
        userName: name,
        userEmail: email,
        userPassword: password,
    });

    return response.data;
};

export const registerCenter = async (
    email: string,
    contact: string,
    name: string,
    registrationNo: string,
    companyType: string
) => {
    const response = await apiClient.post(
        `${API_BASE_DRIVING_CENTER_APPLICATION}/submit`,
        {
            companyName: name,
            companyEmail: email,
            companyContact: contact,
            registrationNumber: registrationNo,
            companyType: companyType,
        }
    );

    return response.data;
};

export const changePassword = async (
    currentPassword: string,
    newPassword: string,
    confirmNewPassword: string
) => {
    const token = localStorage.getItem("token");

    const response = await apiClient.post(
        `${API_BASE_USER}/change-password`,
        {
            currentPassword,
            newPassword,
            confirmNewPassword,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

export const refreshAccessToken = async (refreshToken: string) => {
    const response = await axios.post(`${API_BASE_USER}/refresh-token`, {
        refreshToken,
    });

    return response.data;
};

export const logoutUser = async (refreshToken: string) => {
    const response = await axios.post(`${API_BASE_USER}/logout`, {
        refreshToken,
    });

    return response.data;
};

export const forgotPassword = async (email: string) => {
    const response = await apiClient.post(`${API_BASE_USER}/forgot-password`, {
        userEmail: email,
    });

    return response.data;
};

export const resetPassword = async (
    email: string,
    token: string,
    newPassword: string,
    confirmNewPassword: string
) => {
    const response = await apiClient.post(`${API_BASE_USER}/reset-password`, {
        email,
        token,
        newPassword,
        confirmNewPassword,
    });

    return response.data;
};

export const getDrivingCenterProfile = async () => {
    const response = await apiClient.get(
        "https://localhost:7234/api/drivingcenters/DrivingCenter/my-profile"
    );

    return response.data;
};

export const setupDrivingCenterProfile = async (payload: {
    address: string;
    district: string;
    municipality: string;
    latitude: number | null;
    longitude: number | null;
    description: string;
    packages: {
        serviceType: string;
        durationType: string;
        priceNpr: number;
    }[];
}) => {
    const response = await apiClient.post(
        "https://localhost:7234/api/drivingcenters/DrivingCenter/setup-profile",
        payload
    );

    return response.data;
};