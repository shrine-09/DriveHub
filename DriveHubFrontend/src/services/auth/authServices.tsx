import axios from "axios";

const API_BASE_USER = "https://localhost:7234/api/users/User";
const API_BASE_DRIVING_CENTER_APPLICATION =
    "https://localhost:7234/api/drivingcenter-applications";

export const loginUser = async (email: string, password: string) => {
    const response = await axios.post(`${API_BASE_USER}/login`, {
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
    const response = await axios.post(`${API_BASE_USER}/register`, {
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
    const response = await axios.post(
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

    const response = await axios.post(
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

