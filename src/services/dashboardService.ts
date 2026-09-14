import apiService from "../api/apiService";

import type {
    DashboardStats
} from "../interfaces/dashboard";

const dashboardService = {
    getStats(): Promise<DashboardStats> {
        return apiService.get<
            DashboardStats
        >(
            "/dashboard"
        );
    }
};

export default dashboardService;