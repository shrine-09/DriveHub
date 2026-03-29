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
    latitude: number;
    longitude: number;
    description?: string;
    packages: {
        serviceType: string;
        durationInDays: number;
        priceNpr: number;
    }[];
}) => {
    const token = localStorage.getItem("token");

    const response = await apiClient.post(
        "https://localhost:7234/api/drivingcenters/DrivingCenter/setup-profile",
        payload,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

export const getDrivingCenterDashboardSummary = async () => {
    const response = await apiClient.get(
        "https://localhost:7234/api/drivingcenters/DrivingCenter/dashboard-summary"
    );

    return response.data;
};

export const bookDrivingCenter = async (payload: {
    drivingCenterId: number;
    serviceType: string;
    durationInDays: number;
    startDate: string;
}) => {
    const response = await apiClient.post(
        "https://localhost:7234/api/users/User/book-driving-center",
        payload
    );

    return response.data;
};

export const getPendingLearners = async () => {
    const response = await apiClient.get(
        "https://localhost:7234/api/drivingcenters/DrivingCenter/pending-bookings"
    );

    return response.data;
};

export const startTraining = async (bookingId: number) => {
    const response = await apiClient.put(
        `https://localhost:7234/api/drivingcenters/DrivingCenter/start-training/${bookingId}`
    );

    return response.data;
};

export const getActiveLearners = async () => {
    const response = await apiClient.get(
        "https://localhost:7234/api/drivingcenters/DrivingCenter/active-learners"
    );

    return response.data;
};

export const getInactiveLearners = async () => {
    const response = await apiClient.get(
        "https://localhost:7234/api/drivingcenters/DrivingCenter/inactive-learners"
    );

    return response.data;
};

export const getPublicDrivingCenters = async () => {
    const response = await apiClient.get(
        "https://localhost:7234/api/drivingcenters/DrivingCenter/public-list"
    );

    return response.data;
};

export const getMyBookings = async () => {
    const response = await apiClient.get(
        "https://localhost:7234/api/users/User/my-bookings"
    );

    return response.data;
};

export const recordTrainingSession = async (payload: {
    bookingId: number;
    date: string;
    isPresent: boolean;
    vehicleControlRating: number | null;
    trafficAwarenessRating: number | null;
    confidenceDisciplineRating: number | null;
    remarks: string;
}) => {
    const response = await apiClient.post(
        "https://localhost:7234/api/drivingcenters/DrivingCenter/record-training-session",
        payload
    );

    return response.data;
};

export const getLearnerSessionHistory = async (bookingId: number) => {
    const response = await apiClient.get(
        `https://localhost:7234/api/drivingcenters/DrivingCenter/learner-session-history/${bookingId}`
    );

    return response.data;
};

export const extendLearner = async (bookingId: number, extraDays: number) => {
    const response = await apiClient.put(
        `https://localhost:7234/api/drivingcenters/DrivingCenter/extend-learner/${bookingId}`,
        { extraDays }
    );

    return response.data;
};