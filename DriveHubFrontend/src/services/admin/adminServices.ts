import apiClient from "@/services/apiClient";

const API_BASE_ADMIN = "https://localhost:7234/api/admin";

export const getPendingDrivingCenterApplications = async () => {
    const response = await apiClient.get(
        `${API_BASE_ADMIN}/pending-driving-center-applications`
    );

    return response.data;
};

export const approveDrivingCenterApplication = async (id: number) => {
    const response = await apiClient.put(
        `${API_BASE_ADMIN}/approve-driving-center-application/${id}`
    );

    return response.data;
};

export const rejectDrivingCenterApplication = async (
    id: number,
    adminRemarks?: string
) => {
    const response = await apiClient.put(
        `${API_BASE_ADMIN}/reject-driving-center-application/${id}`,
        {
            adminRemarks: adminRemarks || "",
        }
    );

    return response.data;
};