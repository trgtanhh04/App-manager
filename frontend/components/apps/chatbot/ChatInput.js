import { useState, useRef } from 'react';
import { FaPaperclip, FaPaperPlane, FaTimes } from 'react-icons/fa';
import styles from '../../../styles/apps/chatbot/ChatbotPage.module.css';

export default function ChatInput({ 
  onSendMessage, 
  onFileUpload,
  isLoading, 
  disabled,
  placeholder = "Ask a question about your document..."
}) {
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedFile) {
      // Upload file first
      await onFileUpload(selectedFile);
      setSelectedFile(null);
      return;
    }
    
    if (message.trim() && onSendMessage) {
      onSendMessage(message.trim());
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file
      const maxSize = 10 * 1024 * 1024; // 10MB
      const allowedExtensions = ['.pdf', '.docx', '.doc', '.txt', '.csv', '.xlsx', '.xls'];
      const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
      
      if (file.size > maxSize) {
        alert('File size must be less than 10MB');
        return;
      }
      
      if (!allowedExtensions.includes(extension)) {
        alert('File type not supported');
        return;
      }
      
      setSelectedFile(file);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  };

  const canSend = (message.trim() || selectedFile) && !isLoading && !disabled;

  return (
    <div className={styles.chatInputContainer}>
      <div className={styles.chatInputArea}>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputContainer}>
            {selectedFile && (
              <div className={styles.fileIndicator}>
                <FaPaperclip size={12} />
                <span>{selectedFile.name}</span>
                <span>({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                <button
                  type="button"
                  className={styles.removeFileBtn}
                  onClick={removeFile}
                  title="Remove file"
                >
                  <FaTimes size={12} />
                </button>
              </div>
            )}
            
            <button
              type="button"
              className={styles.fileUploadBtn}
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              title="Attach file"
            >
              <FaPaperclip size={16} />
            </button>
            
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={selectedFile ? "Click send to upload file..." : placeholder}
              className={styles.messageInput}
              disabled={isLoading || disabled}
              rows={1}
            />
            
            <button
              type="submit"
              className={styles.sendBtn}
              disabled={!canSend}
              title="Send message"
            >
              <FaPaperPlane size={14} />
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              className={styles.hiddenFileInput}
              onChange={handleFileSelect}
              accept=".pdf,.docx,.doc,.txt,.csv,.xlsx,.xls"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
