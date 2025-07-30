import { useState } from "react";
import { apiService } from "../services/apiService";

// Custom hook để quản lý apps operations
export const useAppsManager = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  // Tạo app mới
  const createApp = async (appData) => {
    setIsCreating(true);
    setError(null);
    
    try {
      const result = await apiService.createApp(appData);
      if (result.success) {
        return { success: true, data: result.data };
      } else {
        setError(result.error.message || "Failed to create app");
        return { success: false, error: result.error };
      }
    } catch (error) {
      setError(error.message);
      return { success: false, error };
    } finally {
      setIsCreating(false);
    }
  };

  // Cập nhật app
  const updateApp = async (appId, appData) => {
    setIsUpdating(true);
    setError(null);
    
    try {
      const result = await apiService.updateApp(appId, appData);
      if (result.success) {
        return { success: true, data: result.data };
      } else {
        setError(result.error.message || "Failed to update app");
        return { success: false, error: result.error };
      }
    } catch (error) {
      setError(error.message);
      return { success: false, error };
    } finally {
      setIsUpdating(false);
    }
  };

  // Xóa app
  const deleteApp = async (appId) => {
    setIsDeleting(true);
    setError(null);
    
    try {
      const result = await apiService.deleteApp(appId);
      if (result.success) {
        return { success: true, data: result.data };
      } else {
        setError(result.error.message || "Failed to delete app");
        return { success: false, error: result.error };
      }
    } catch (error) {
      setError(error.message);
      return { success: false, error };
    } finally {
      setIsDeleting(false);
    }
  };

  // Lấy chi tiết app
  const getAppDetail = async (appId) => {
    try {
      const result = await apiService.getAppDetail(appId);
      if (result.success) {
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error };
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  return {
    // States
    isCreating,
    isUpdating,
    isDeleting,
    error,
    
    // Actions
    createApp,
    updateApp,
    deleteApp,
    getAppDetail,
    clearError
  };
};
