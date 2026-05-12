import { API_PATHS } from "../utils/apiPath";
import axiosInstance from "../utils/axiosInstance";

const getDashboardData = async () => {
    try {
        const response = await axiosInstance.get(API_PATHS.PROGRESS.GET_DASHBOARD_DATA);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "An error occurred while fetching dashboard data." }
    }
}

const progressService = {
    getDashboardData
}

export default progressService;
