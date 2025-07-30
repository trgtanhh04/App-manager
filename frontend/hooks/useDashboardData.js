import { useState, useEffect } from "react";
import { apiService } from "../services/apiService";

// Custom hook để quản lý dashboard data
export const useDashboardData = () => {
  const [backendStatus, setBackendStatus] = useState("Checking...");
  const [apiData, setApiData] = useState(null);
  const [appsData, setAppsData] = useState(null);
  const [appsStatus, setAppsStatus] = useState("Loading...");
  const [loading, setLoading] = useState(true);

  // Hàm fetch backend status
  const fetchBackendStatus = async () => {
    const result = await apiService.getBackendStatus();
    if (result.success) {
      setBackendStatus("Connected");
      setApiData(result.data);
    } else {
      setBackendStatus("Disconnected");
      setApiData(null);
    }
  };

  // Hàm fetch apps data
  const fetchAppsData = async () => {
    const result = await apiService.getApps();
    
    if (result.success) {
      setAppsStatus("Connected");
      setAppsData(result.data);
    } else {
      setAppsStatus("Failed");
      setAppsData(null);
    }
  };

  // Hàm refresh data
  const refreshData = async () => {
    setLoading(true);
    await Promise.all([
      fetchBackendStatus(),
      fetchAppsData()
    ]);
    setLoading(false);
  };

  // Effect để load data lần đầu
  useEffect(() => {
    refreshData();
  }, []);

  return {
    // Data states
    backendStatus,
    apiData,
    appsData,
    appsStatus,
    loading,
    
    // Actions
    refreshData,
    fetchBackendStatus,
    fetchAppsData,
    
    // Additional helpers
    refreshAppsOnly: fetchAppsData
  };
};
