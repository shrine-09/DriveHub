import axios from "axios";

const API_BASE_USER = "https://localhost:7234/api/users/User";
const API_BASE_DrivingCenter = "https://localhost:7234/api/drivingcenters/DrivingCenter";

export const loginUser = async (
    email: string,
    password: string
) => {
    const response = await axios.post(`${API_BASE_USER}/login`, { 
        userEmail: email, 
        userPassword: password 
    });
    return response.data;
}

export const registerUser = async (
    name: string, 
    email: string, 
    password: string
) => {
    const response = await axios.post(`${API_BASE_USER}/register`, { 
        userName: name,
        userEmail: email, 
        userPassword: password 
    });
    return response.data;
}

export const registerCenter = async (
    email: string, 
    contact: string, 
    name: string, 
    registrationNo: string, 
    companyType: "public" | "private" | "nonprofit" | undefined
) => {
    const response = await axios.post(`${API_BASE_DrivingCenter}/register`, {
        companyName: name,
        companyEmail: email,
        companyContact: contact,
        registrationNumber: registrationNo,
        companyType: companyType
    });
    return response.data;
}