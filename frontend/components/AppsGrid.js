import Card from "./Card";
import { FaDesktop, FaMobile, FaGlobe, FaArrowUp, FaEye, FaEdit, FaTrash, FaLock, FaUnlock } from "react-icons/fa";
import styles from "../styles/Dashboard.module.css";

const AppsGrid = ({ appsData, appsStatus, onViewApp, onEditApp, onDeleteApp, onToggleLock }) => {
  // Hàm lấy icon cho app dựa trên category
  const getAppIcon = (category, index) => {
    const iconMap = {
      "Bán hàng": <FaDesktop />,
      "Nhân sự": <FaMobile />,
      "Marketing": <FaGlobe />,
      "default": <FaDesktop />
    };
    return iconMap[category] || iconMap.default;
  };

  // Hàm lấy màu cho app dựa trên category
  const getAppColor = (category, index) => {
    const colorMap = {
      "Bán hàng": "#28a745",    // Green
      "Nhân sự": "#007bff",     // Blue
      "Marketing": "#dc3545",   // Red
      "Tài chính": "#ffc107",   // Yellow
      "Công nghệ": "#17a2b8",   // Teal
      "Giao dục": "#6610f2",    // Purple
      "Khác": "#6c757d"         // Gray
    };
    
    const fallbackColors = ["#1877f2", "#1da1f2", "#db4437", "#28a745", "#ffc107"];
    
    return colorMap[category] || fallbackColors[index % fallbackColors.length];
  };

  const handleCardClick = (app) => {
    // Remove this function since we'll use direct navigation
  };

  if (appsData && appsData.apps && appsData.apps.length > 0) {
    return (
      <div className={styles.appsSection}>
        <div className={styles.cardsGrid}>
          {appsData.apps.map((app, index) => (
            <div key={app._id || index} className={styles.appCardWrapper}>
              <Card 
                title={app.category || "Unknown Category"} 
                value={app.name} 
                percentage="Active Application"
                subtitle={app.owner || "No owner"}
                color={getAppColor(app.category, index)} 
                icon={getAppIcon(app.category, index)}
                target={app.website ? "Active" : "No Website"}
                duration={app.description ? app.description.substring(0, 30) + "..." : "No description"}
                progressPercent={Math.min(90, 60 + (index * 5))}
                appId={app._id}
                enableNavigation={true}
              />
              
              {/* Action buttons */}
              <div className={styles.cardActions}>
                <button 
                  className={styles.actionBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onViewApp) onViewApp(app);
                  }}
                  title="View Details"
                >
                  <FaEye />
                </button>
                <button 
                  className={styles.actionBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onEditApp) onEditApp(app);
                  }}
                  title="Edit App"
                >
                  <FaEdit />
                </button>
                <button 
                  className={`${styles.actionBtn} ${app.is_locked ? styles.lockBtn : styles.unlockBtn}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onToggleLock) onToggleLock(app);
                  }}
                  title={app.is_locked ? "Unlock App" : "Lock App"}
                >
                  {app.is_locked ? <FaLock /> : <FaUnlock />}
                </button>
                <button 
                  className={`${styles.actionBtn} ${styles.deleteBtn} ${app.is_locked ? styles.disabled : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!app.is_locked && onDeleteApp) onDeleteApp(app);
                  }}
                  title={app.is_locked ? "App is locked - cannot delete" : "Delete App"}
                  disabled={app.is_locked}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Loading or empty state
  return (
    <div className={styles.appsSection}>
      {appsStatus === "Loading..." && (
        <div className={styles.cardsGrid}>
          {[...Array(3)].map((_, index) => (
            <Card 
              key={index}
              title="Loading..." 
              value="Apps Data" 
              percentage="Loading..." 
              subtitle="Please wait"
              color="#6c757d" 
              icon={<FaArrowUp />}
              progressPercent={30}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AppsGrid;
