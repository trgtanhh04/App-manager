import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../../../components/Header';
import Sidebar from '../../../components/Sidebar';
import FileUploader from '../../../components/apps/chatbot/FileUploader';
import ChatInterface from '../../../components/apps/chatbot/ChatInterface';
import styles from '../../../styles/apps/chatbot/ChatbotPage.module.css';
import { apiService } from '../../../services/chatbot/apiService';

export default function ChatbotPage() {
  const [sessionId, setSessionId] = useState('');
  const [messages, setMessages] = useState([]);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    // Generate session ID on component mount
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(newSessionId);
  }, []);

  const resetChat = () => {
    setMessages([]);
    setIsFileUploaded(false);
    setError(null);
    setUploadError(null);
    // Generate new session ID
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(newSessionId);
  };

  const handleFileUpload = async (file, sessionId) => {
    setIsUploading(true);
    setUploadError(null);
    
    try{
        const result = await apiService.uploadFile(file, sessionId);
        setIsFileUploaded(true);
        console.log('File upload successful:', result);
        
        // Thêm welcome message khi upload thành công
        setMessages([{
            role: 'assistant',
            content: 'Tài liệu đã được tải lên và xử lý thành công! Bạn có thể đặt câu hỏi về nội dung tài liệu.',
            timestamp: new Date()
        }]);
        
    } catch (error) {
        console.error('Error uploading file:', error);
        setUploadError('Failed to upload file. Please try again.');
    } finally {
        setIsUploading(false);
    }
  };

  const handleSendMessage = async (message, sessionId) => {
    // Add user message to chat
    setMessages(prev => [...prev,{
        role: 'user',
        content: message,
        timestamp: new Date()
    }]);

    setIsLoading(true);
    setError(null);
    
    try {
        const result = await apiService.askQuestion(message, sessionId);
        console.log('Backend response:', result); // Debug log
        
        // Add AI response
        setMessages(prev => [...prev, {
            role: 'assistant',
            content: result.answer || result.response || 'No response received',
            timestamp: new Date()
        }]);
        
    } catch (error) {
        console.error('Error sending message:', error);
        setError('Failed to get response. Please try again.');
        // Add error message to chat với thông tin chi tiết hơn
        setMessages(prev => [...prev, {
            role: 'assistant',
            content: `Xin lỗi, tôi gặp lỗi khi xử lý câu hỏi của bạn. Chi tiết lỗi: ${error.message}. Vui lòng thử lại.`,
            timestamp: new Date()
        }]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>AI Chatbot - App Manager</title>
        <meta name="description" content="Upload documents and chat with AI" />
      </Head>

      <div className={styles.pageContainer}>
        <Header />
        <div className={styles.mainContent}>
          <Sidebar />
          
          <div className={styles.chatbotContent}>
            <div className={styles.chatbotLayout}>
              {/* File Upload Section */}
              <div className={styles.uploadSection}>
                <FileUploader 
                  onFileUpload={handleFileUpload}
                  uploading={isUploading}
                  sessionId={sessionId}
                />
                
                {uploadError && (
                  <div className={styles.errorStatus}>
                    <div className={styles.errorMessage}>
                      ❌ {uploadError}
                    </div>
                  </div>
                )}
                
                {isFileUploaded && (
                  <div className={styles.uploadStatus}>
                    <div className={styles.successMessage}>
                      ✅ Document uploaded and processed successfully!
                    </div>
                    <button 
                      onClick={resetChat}
                      className={styles.resetBtn}
                      style={{ marginTop: '12px', width: '100%' }}
                    >
                      🔄 Reset & Upload New Document
                    </button>
                  </div>
                )}
              </div>

              {/* Chat Section */}
              <div className={styles.chatSection}>
                <ChatInterface 
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading}
                  sessionId={sessionId}
                  isFileUploaded={isFileUploaded}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
