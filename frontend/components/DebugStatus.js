import styles from "../styles/Dashboard.module.css";

const DebugStatus = ({ backendStatus, appsStatus, appsData, apiData }) => {
  return (
    <div className={`${styles.backendStatus} ${backendStatus === "Connected" ? styles.connected : styles.disconnected}`}>
      <div style={{ marginBottom: "8px" }}>
        <strong>Backend Status:</strong> {backendStatus} | 
        <strong> Apps Status:</strong> <span style={{
          color: appsStatus === "Connected" ? "#2ed573" : "#ff4757"
        }}> {appsStatus}</span>
        {appsData && appsData.apps && (
          <span> ({appsData.apps.length} apps found)</span>
        )}
      </div>
      
      {apiData && (
        <details className={styles.apiDetails}>
          <summary className={styles.apiSummary}>
            View Backend API Response
          </summary>
          <pre className={styles.apiResponse}>
            {JSON.stringify(apiData, null, 2)}
          </pre>
        </details>
      )}

      {appsData && (
        <details className={styles.apiDetails}>
          <summary className={styles.apiSummary}>
            View Apps API Response
          </summary>
          <pre className={styles.apiResponse}>
            {JSON.stringify(appsData, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
};

export default DebugStatus;
