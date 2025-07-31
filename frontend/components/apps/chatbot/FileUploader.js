import { useState } from 'react';
import { FaCloudUploadAlt, FaFile, FaTimes } from 'react-icons/fa';
import styles from '../../../styles/apps/chatbot/FileUploader.module.css';

export default function FileUploader({ onFileUpload, uploading, sessionId }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const validation = validateFile(file);
      
      if (validation) {
        alert(validation);
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validation = validateFile(file);
      
      if (validation) {
        alert(validation);
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile && onFileUpload) {
      onFileUpload(selectedFile, sessionId);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const validateFile = (file) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedExtensions = ['.pdf', '.docx', '.doc', '.txt', '.csv', '.xlsx', '.xls'];
    
    if (file.size > maxSize) {
        return 'File size must be less than 10MB';
    }
    
    const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    if (!allowedExtensions.includes(extension)) {
        return 'File type not supported';
    }
    
    return null;
    };


  return (
    <div className={styles.uploaderContainer}>
      <h3 className={styles.title}>Upload Document</h3>
      
      {!selectedFile ? (
        <div 
          className={`${styles.dropZone} ${dragActive ? styles.active : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="file-upload"
            className={styles.fileInput}
            onChange={handleFileSelect}
            accept=".pdf,.docx,.doc,.txt,.csv,.xlsx,.xls"
          />
          <label htmlFor="file-upload" className={styles.uploadLabel}>
            <FaCloudUploadAlt className={styles.uploadIcon} />
            <div className={styles.uploadText}>
              <p className={styles.primaryText}>Click to upload or drag and drop</p>
              <p className={styles.secondaryText}>
                PDF, DOCX, TXT, CSV, XLSX (max 10MB)
              </p>
            </div>
          </label>
        </div>
      ) : (
        <div className={styles.filePreview}>
          <div className={styles.fileInfo}>
            <FaFile className={styles.fileIcon} />
            <div className={styles.fileDetails}>
              <p className={styles.fileName}>{selectedFile.name}</p>
              <p className={styles.fileSize}>
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button 
              onClick={removeFile}
              className={styles.removeBtn}
              disabled={uploading}
            >
              <FaTimes />
            </button>
          </div>
          
          <button 
            onClick={handleUpload}
            className={styles.uploadBtn}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload & Process'}
          </button>
        </div>
      )}
      
      <div className={styles.supportedFormats}>
        <p>Supported formats: PDF, Word, Excel, CSV, Text files</p>
      </div>
    </div>
  );
}
