import { useState, useEffect } from "react";
import styles from "../styles/AppForm.module.css";

const AppForm = ({ app, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    website: "",
    owner: "admin" // Default owner
  });

  const [errors, setErrors] = useState({});

  // Load data nếu đang edit app
  useEffect(() => {
    if (app) {
      setFormData({
        name: app.name || "",
        description: app.description || "",
        category: app.category || "",
        website: app.website || "",
        owner: app.owner || "admin"
      });
    }
  }, [app]);

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "App name is required";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (formData.website && !isValidUrl(formData.website)) {
      newErrors.website = "Please enter a valid URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate URL
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error khi user đang nhập
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const categories = [
    "Bán hàng",
    "Nhân sự", 
    "Marketing",
    "Tài chính",
    "Kỹ thuật",
    "Khách hàng",
    "Giao dục",
    "Công nghệ",
    "Khác"
  ];

  return (
    <div className={styles.modal} onClick={onCancel}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>{app ? "Edit App" : "Create New App"}</h3>
          <button 
            className={styles.closeBtn}
            onClick={onCancel}
            disabled={isLoading}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              App Name <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`${styles.input} ${errors.name ? styles.error : ''}`}
              placeholder="Enter app name"
              disabled={isLoading}
            />
            {errors.name && <span className={styles.errorText}>{errors.name}</span>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Category <span className={styles.required}>*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`${styles.select} ${errors.category ? styles.error : ''}`}
              disabled={isLoading}
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <span className={styles.errorText}>{errors.category}</span>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Description <span className={styles.required}>*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`${styles.textarea} ${errors.description ? styles.error : ''}`}
              placeholder="Describe your app"
              rows={4}
              disabled={isLoading}
            />
            {errors.description && <span className={styles.errorText}>{errors.description}</span>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Website URL</label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className={`${styles.input} ${errors.website ? styles.error : ''}`}
              placeholder="https://example.com"
              disabled={isLoading}
            />
            {errors.website && <span className={styles.errorText}>{errors.website}</span>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Owner</label>
            <input
              type="text"
              name="owner"
              value={formData.owner}
              onChange={handleChange}
              className={styles.input}
              placeholder="Owner name"
              disabled={isLoading}
            />
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              onClick={onCancel}
              className={styles.cancelBtn}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isLoading}
            >
              {isLoading 
                ? (app ? "Updating..." : "Creating...") 
                : (app ? "Update App" : "Create App")
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppForm;
