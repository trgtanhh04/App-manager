// API Service - Xử lý tất cả các API calls
const API_BASE_URL = "http://localhost:8000";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  console.log("Auth token:", token ? "exists" : "not found");
  return {
    "Content-Type": "application/json",
    "accept": "application/json",
    ...(token && { "Authorization": `Bearer ${token}` })
  };
};

export const apiService = {
  // Kiểm tra backend status
  async getBackendStatus() {
    try {
      const response = await fetch(`${API_BASE_URL}/`);
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error("Backend status error:", error);
      return { success: false, error };
    }
  },

  // Lấy danh sách apps
  async getApps() {
    try {
      console.log("Making API call to get apps...");
      const response = await fetch(`${API_BASE_URL}/app/`, {
        method: "POST",
        headers: getAuthHeaders()
      });
      
      console.log("Response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log("Error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Apps API response:", data);
      return { success: true, data };
    } catch (error) {
      console.error("Apps fetch error:", error);
      return { success: false, error };
    }
  },

  // Tạo app mới
  async createApp(appData) {
    try {
      const response = await fetch(`${API_BASE_URL}/app/create`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(appData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error("Create app error:", error);
      return { success: false, error };
    }
  },

  // Lấy chi tiết app
  async getAppDetail(appId) {
    try {
      const response = await fetch(`${API_BASE_URL}/app/detail/${appId}`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error("App detail error:", error);
      return { success: false, error };
    }
  },

  // Cập nhật app
  async updateApp(appId, appData) {
    try {
      const response = await fetch(`${API_BASE_URL}/app/update/${appId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(appData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error("Update app error:", error);
      return { success: false, error };
    }
  },

  // Xóa app
  async deleteApp(appId) {
    try {
      const response = await fetch(`${API_BASE_URL}/app/delete/${appId}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error("Delete app error:", error);
      return { success: false, error };
    }
  }
};
