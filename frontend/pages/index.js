import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import AppsGrid from "../components/AppsGrid";
import AppForm from "../components/AppForm";
import ConfirmDialog from "../components/ConfirmDialog";
import styles from "../styles/Dashboard.module.css";
import { useDashboardData } from "../hooks/useDashboardData";
import { useAppsManager } from "../hooks/useAppsManager";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";

export default function Home() {
  const { user } = useAuth();
  
  // Sử dụng custom hook thay vì quản lý state trực tiếp
  const {
    backendStatus,
    apiData,
    appsData,
    appsStatus,
    loading,
    refreshData,
    refreshAppsOnly
  } = useDashboardData();

  const { createApp, updateApp, deleteApp, isCreating, isUpdating, isDeleting } = useAppsManager();
  
  // State cho modal/form
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showAppDetail, setShowAppDetail] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [appToDelete, setAppToDelete] = useState(null);

  // Xử lý view app detail
  const handleViewApp = (app) => {
    setSelectedApp(app);
    setShowAppDetail(true);
    console.log("View app:", app);
  };

  // Xử lý edit app
  const handleEditApp = (app) => {
    setSelectedApp(app);
    setShowCreateForm(true);
    console.log("Edit app:", app);
  };

  // Xử lý tạo app mới
  const handleCreateApp = () => {
    setSelectedApp(null);
    setShowCreateForm(true);
  };

  // Xử lý submit form (create hoặc update)
  const handleFormSubmit = async (formData) => {
    try {
      let result;
      
      if (selectedApp) {
        // Update existing app
        result = await updateApp(selectedApp._id, formData);
      } else {
        // Create new app
        result = await createApp(formData);
      }

      if (result.success) {
        alert(selectedApp ? "App updated successfully!" : "App created successfully!");
        setShowCreateForm(false);
        setSelectedApp(null);
        // Refresh chỉ apps data để nhanh hơn
        refreshAppsOnly();
      } else {
        alert("Error: " + (result.error?.message || "Something went wrong"));
      }
    } catch (error) {
      console.error("Form submit error:", error);
      alert("Error: " + error.message);
    }
  };

  // Xử lý xóa app
  const handleDeleteApp = (app) => {
    setAppToDelete(app);
    setShowDeleteConfirm(true);
  };

  // Xác nhận xóa app
  const handleConfirmDelete = async () => {
    if (!appToDelete) return;

    try {
      const result = await deleteApp(appToDelete._id);
      
      if (result.success) {
        alert("App deleted successfully!");
        setShowDeleteConfirm(false);
        setAppToDelete(null);
        // Refresh apps data
        refreshAppsOnly();
      } else {
        alert("Error: " + (result.error?.message || "Failed to delete app"));
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error: " + error.message);
    }
  };

  // Hủy xóa app
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setAppToDelete(null);
  };

  // Đóng form
  const handleFormCancel = () => {
    setShowCreateForm(false);
    setSelectedApp(null);
  };

  return (
    <div className={styles.container}>
      <Sidebar />
      
      <div className={styles.content}>
        <Header />
        
        <main className={styles.main}>
          {/* Page Header */}
          <div className={styles.pageHeader}>
            <div>
              <h1 className={styles.pageTitle}>
                Welcome back, {user?.name || 'User'}! 👋
              </h1>
              <p className={styles.pageSubtitle}>
                Manage your applications from one central dashboard
              </p>
            </div>
            <div className={styles.headerActions}>
              <button 
                className={styles.createButton}
                onClick={handleCreateApp}
              >
                ➕ Create App
              </button>
            </div>
          </div>

          {/* Apps Grid - Hiển thị tất cả apps từ database */}
          <AppsGrid 
            appsData={appsData} 
            appsStatus={appsStatus} 
            onViewApp={handleViewApp}
            onEditApp={handleEditApp}
            onDeleteApp={handleDeleteApp}
          />

          {/* App Form Modal - Create/Edit */}
          {showCreateForm && (
            <AppForm
              app={selectedApp}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
              isLoading={isCreating || isUpdating}
            />
          )}

          {/* Delete Confirmation Dialog */}
          <ConfirmDialog
            isOpen={showDeleteConfirm}
            title="Delete App"
            message={`Are you sure you want to delete "${appToDelete?.name}"? This action cannot be undone.`}
            confirmText="Delete"
            cancelText="Cancel"
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
            isLoading={isDeleting}
            type="danger"
          />

          {/* App Detail Modal */}
          {showAppDetail && selectedApp && (
            <div className={styles.modal} onClick={() => setShowAppDetail(false)}>
              <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                  <h3>App Details</h3>
                  <button 
                    className={styles.closeBtn}
                    onClick={() => setShowAppDetail(false)}
                  >
                    ✕
                  </button>
                </div>
                <div className={styles.modalBody}>
                  <p><strong>Name:</strong> {selectedApp.name}</p>
                  <p><strong>Category:</strong> {selectedApp.category}</p>
                  <p><strong>Owner:</strong> {selectedApp.owner}</p>
                  <p><strong>Website:</strong> {selectedApp.website || "No website"}</p>
                  <p><strong>Description:</strong> {selectedApp.description}</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
