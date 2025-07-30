import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { apiService } from '../../../services/apiService';
import { useAppsManager } from '../../../hooks/useAppsManager';
import Header from '../../../components/Header';
import Sidebar from '../../../components/Sidebar';
import AppForm from '../../../components/AppForm';
import styles from '../../../styles/AppEdit.module.css';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

export default function AppEdit() {
  const router = useRouter();
  const { id } = router.query;
  
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { updateApp, isUpdating } = useAppsManager();

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
        setApp(result.data.app);
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

  const handleSubmit = async (formData) => {
    try {
      const result = await updateApp(id, formData);
      
      if (result.success) {
        alert("App updated successfully!");
        router.push(`/app/${id}`); // Redirect back to detail page
      } else {
        alert("Error: " + (result.error?.message || "Something went wrong"));
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Error: " + error.message);
    }
  };

  const handleCancel = () => {
    router.push(`/app/${id}`); // Go back to detail page
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
              <Link href={`/app/${id}`} className={styles.breadcrumbLink}>
                {app.name}
              </Link>
              <span className={styles.breadcrumbSeparator}>/</span>
              <span className={styles.breadcrumbCurrent}>Edit</span>
            </div>
            
            <Link href={`/app/${id}`} className={styles.backButton}>
              <FaArrowLeft /> Back to App
            </Link>
          </div>

          {/* Edit Form */}
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <h1>Edit App: {app.name}</h1>
              <p>Update your application details</p>
            </div>
            
            <AppForm
              app={app}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isLoading={isUpdating}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
