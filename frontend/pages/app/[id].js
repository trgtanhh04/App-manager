import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import styles from '../../styles/AppDetail.module.css';
import Link from 'next/link';
import { FaArrowLeft, FaEdit, FaTrash, FaExternalLinkAlt, FaUser, FaTag, FaCog, FaChartLine, FaUsers, FaShieldAlt, FaRocket, FaFileAlt } from 'react-icons/fa';

export default function AppDetail() {
  const router = useRouter();
  const { id } = router.query;
  
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch app detail
  useEffect(() => {
    if (id) {
      fetchAppDetail();
    }
  }, [id]);

  const fetchAppDetail = async () => {
    try {
      setLoading(true);
      const result = await apiService.getAppDetail(id);
      
      if (result.success) {
        const appData = result.data.app;
        
        // If this is the Chatbot app, redirect to chatbot interface
        if (appData.name === 'Chatbot') {
          router.push('/apps/chatbot');
          return;
        }
        
        setApp(appData);
        setError(null);
      } else {
        setError("Failed to load app details");
        setApp(null);
      }
    } catch (err) {
      console.error("Error fetching app detail:", err);
      setError("Error loading app");
      setApp(null);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    // Navigate to edit page or open modal
    router.push(`/app/${id}/edit`);
  };

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete "${app?.name}"?`)) {
      try {
        const result = await apiService.deleteApp(id);
        if (result.success) {
          alert("App deleted successfully!");
          router.push('/'); // Redirect to dashboard
        } else {
          alert("Error deleting app");
        }
      } catch (err) {
        alert("Error deleting app");
      }
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <Sidebar />
        <div className={styles.content}>
          <Header />
          <main className={styles.main}>
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Loading app details...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className={styles.container}>
        <Sidebar />
        <div className={styles.content}>
          <Header />
          <main className={styles.main}>
            <div className={styles.error}>
              <h2>❌ Error</h2>
              <p>{error || "App not found"}</p>
              <Link href="/" className={styles.backLink}>
                <FaArrowLeft /> Back to Dashboard
              </Link>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Sidebar />
      
      <div className={styles.content}>
        <Header />
        
        <main className={styles.main}>
          {/* Header with breadcrumb */}
          <div className={styles.pageHeader}>
            <div className={styles.breadcrumb}>
              <Link href="/" className={styles.breadcrumbLink}>
                Dashboard
              </Link>
              <span className={styles.breadcrumbSeparator}>/</span>
              <span className={styles.breadcrumbCurrent}>{app.name}</span>
            </div>
            
            <div className={styles.headerActions}>
              <Link href="/" className={styles.backButton}>
                <FaArrowLeft /> Back
              </Link>
              <button onClick={handleEdit} className={styles.editButton}>
                <FaEdit /> Edit
              </button>
              <button onClick={handleDelete} className={styles.deleteButton}>
                <FaTrash /> Delete
              </button>
            </div>
          </div>

          {/* App Info Card */}
          <div className={styles.appCard}>
            <div className={styles.appHeader}>
              <div className={styles.appIcon}>
                📱
              </div>
              <div className={styles.appInfo}>
                <h1 className={styles.appName}>{app.name}</h1>
                <div className={styles.appMeta}>
                  <span className={styles.category}>
                    <FaTag /> {app.category}
                  </span>
                  <span className={styles.owner}>
                    <FaUser /> {app.owner}
                  </span>
                </div>
              </div>
              {app.website && (
                <a 
                  href={app.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.websiteLink}
                >
                  <FaExternalLinkAlt /> Visit Website
                </a>
              )}
            </div>
            
            <div className={styles.appDescription}>
              <h3>Description</h3>
              <p>{app.description || "No description available"}</p>
            </div>
          </div>

          {/* App Features/Actions */}
          <div className={styles.featuresSection}>
            <h2>App Features</h2>
            <div className={styles.featuresGrid}>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <FaCog />
                </div>
                <h3>Settings</h3>
                <p>Configure app settings and preferences</p>
                <button className={styles.featureButton}>Open Settings</button>
              </div>
              
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <FaChartLine />
                </div>
                <h3>Analytics</h3>
                <p>View app usage statistics and reports</p>
                <button className={styles.featureButton}>View Analytics</button>
              </div>
              
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <FaUsers />
                </div>
                <h3>Users</h3>
                <p>Manage app users and permissions</p>
                <button className={styles.featureButton}>Manage Users</button>
              </div>
              
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <FaShieldAlt />
                </div>
                <h3>Security</h3>
                <p>Configure security settings and access control</p>
                <button className={styles.featureButton}>Security Settings</button>
              </div>
              
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <FaRocket />
                </div>
                <h3>Deploy</h3>
                <p>Deploy updates and manage versions</p>
                <button className={styles.featureButton}>Deploy App</button>
              </div>
              
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <FaFileAlt />
                </div>
                <h3>Logs</h3>
                <p>View application logs and debug information</p>
                <button className={styles.featureButton}>View Logs</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
