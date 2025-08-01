import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FaArrowLeft } from 'react-icons/fa';
import ChatInterface from '../../../components/apps/chatbot/ChatInterface';
import ChatSidebar from '../../../components/apps/chatbot/ChatSidebar';
import ChatInput from '../../../components/apps/chatbot/ChatInput';
import styles from '../../../styles/apps/chatbot/ChatbotPage.module.css';
import { apiService } from '../../../services/chatbot/apiService';

export default function ChatbotPage() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState('');
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [documentText, setDocumentText] = useState('');
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = () => {
    // Load conversations from localStorage
    const savedConversations = localStorage.getItem('chatbot_conversations');
    if (savedConversations) {
      const parsed = JSON.parse(savedConversations);
      setConversations(parsed);
      
      // Load the most recent conversation
      if (parsed.length > 0) {
        const mostRecent = parsed[0];
        setActiveConversationId(mostRecent.id);
        setSessionId(mostRecent.sessionId);
        setMessages(mostRecent.messages || []);
        setIsFileUploaded(mostRecent.isFileUploaded || false);
        setFileName(mostRecent.fileName || '');
        setDocumentText(mostRecent.documentText || '');
      } else {
        startNewConversation();
      }
    } else {
      startNewConversation();
    }
  };

  const startNewConversation = () => {
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newConversation = {
      id: Date.now().toString(),
      sessionId: newSessionId,
      title: 'New conversation',
      messages: [],
      isFileUploaded: false,
      fileName: '',
      documentText: '',
      createdAt: new Date().toISOString()
    };

    setActiveConversationId(newConversation.id);
    setSessionId(newSessionId);
    setMessages([]);
    setIsFileUploaded(false);
    setFileName('');
    setDocumentText('');
    setError(null);
    setUploadError(null);

    const updatedConversations = [newConversation, ...conversations];
    setConversations(updatedConversations);
    localStorage.setItem('chatbot_conversations', JSON.stringify(updatedConversations));
  };

  const selectConversation = (conversationId) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      setActiveConversationId(conversationId);
      setSessionId(conversation.sessionId);
      setMessages(conversation.messages || []);
      setIsFileUploaded(conversation.isFileUploaded || false);
      setFileName(conversation.fileName || '');
      setDocumentText(conversation.documentText || '');
      setError(null);
      setUploadError(null);
    }
  };

  const deleteConversation = (conversationId) => {
    const updatedConversations = conversations.filter(c => c.id !== conversationId);
    setConversations(updatedConversations);
    localStorage.setItem('chatbot_conversations', JSON.stringify(updatedConversations));

    if (activeConversationId === conversationId) {
      if (updatedConversations.length > 0) {
        selectConversation(updatedConversations[0].id);
      } else {
        startNewConversation();
      }
    }
  };

  const updateCurrentConversation = (updates) => {
    const updatedConversations = conversations.map(c => 
      c.id === activeConversationId 
        ? { ...c, ...updates, updatedAt: new Date().toISOString() }
        : c
    );
    setConversations(updatedConversations);
    localStorage.setItem('chatbot_conversations', JSON.stringify(updatedConversations));
  };

  const handleFileUpload = async (file) => {
    setIsUploading(true);
    setUploadError(null);
    
    try {
        const result = await apiService.uploadFile(file, sessionId);
        setIsFileUploaded(true);
        setFileName(file.name);
        setDocumentText(result.text || '');
        
        // Update conversation title if it's new
        const updatedTitle = conversations.find(c => c.id === activeConversationId)?.title === 'New conversation' 
          ? file.name 
          : conversations.find(c => c.id === activeConversationId)?.title;

        updateCurrentConversation({
          title: updatedTitle,
          isFileUploaded: true,
          fileName: file.name,
          documentText: result.text || ''
        });

        console.log('File upload successful:', result);
        
        // Add welcome message
        const welcomeMessage = {
            role: 'assistant',
            content: `Document "${file.name}" has been uploaded and processed successfully! You can now ask questions about its content.`,
            timestamp: new Date()
        };
        
        const newMessages = [...messages, welcomeMessage];
        setMessages(newMessages);
        updateCurrentConversation({ messages: newMessages });
        
    } catch (error) {
        console.error('Error uploading file:', error);
        setUploadError('Failed to upload file. Please try again.');
    } finally {
        setIsUploading(false);
    }
  };

  const handleSendMessage = async (message) => {
    // Add user message to chat
    const userMessage = {
        role: 'user',
        content: message,
        timestamp: new Date()
    };
    
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);

    setIsLoading(true);
    setError(null);
    
    try {
        const result = await apiService.askQuestion(message, sessionId);
        
        // Add AI response
        const aiMessage = {
            role: 'assistant',
            content: result.answer || result.response || 'No response received',
            timestamp: new Date()
        };
        
        const finalMessages = [...newMessages, aiMessage];
        setMessages(finalMessages);
        
        // Update conversation title from first user message
        const currentConversation = conversations.find(c => c.id === activeConversationId);
        if (currentConversation?.title === 'New conversation') {
          const title = message.length > 50 ? message.substring(0, 50) + '...' : message;
          updateCurrentConversation({ title, messages: finalMessages });
        } else {
          updateCurrentConversation({ messages: finalMessages });
        }
        
    } catch (error) {
        console.error('Error sending message:', error);
        
        // Check if this is a "no document uploaded" error
        let userFriendlyMessage = error.message;
        if (error.message.includes("upload a document first") || error.message.includes("Vui lòng tải lên")) {
            setError('Vui lòng tải lên tài liệu trước khi đặt câu hỏi!');
            userFriendlyMessage = "📄 Tôi cần bạn tải lên một tài liệu trước để có thể trả lời câu hỏi của bạn. Hãy sử dụng nút 📎 bên dưới để tải lên file!";
        } else {
            setError('Failed to get response. Please try again.');
            userFriendlyMessage = `Xin lỗi, tôi gặp lỗi khi xử lý câu hỏi của bạn. Lỗi: ${error.message}. Vui lòng thử lại.`;
        }
        
        const errorMessage = {
            role: 'assistant',
            content: userFriendlyMessage,
            timestamp: new Date()
        };
        
        const errorMessages = [...newMessages, errorMessage];
        setMessages(errorMessages);
        updateCurrentConversation({ messages: errorMessages });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>ChatTTA - App Manager</title>
        <meta name="description" content="AI Chat with Document Upload" />
      </Head>

      <div className={styles.chatContainer}>
        <ChatSidebar
          conversations={conversations}
          activeConversationId={activeConversationId}
          onNewConversation={startNewConversation}
          onSelectConversation={selectConversation}
          onDeleteConversation={deleteConversation}
        />
        
        <div className={styles.chatMain}>
          <div className={styles.chatHeader}>
            <button 
              className={styles.backButton}
              onClick={() => router.push('/')}
              title="Back to Home"
            >
              <FaArrowLeft />
            </button>
            <h2>ChatTTA</h2>
          </div>
          
          <div className={styles.chatMessages}>
            <ChatInterface 
              messages={messages}
              isLoading={isLoading}
              error={error}
            />
          </div>
          
          <div className={styles.chatInputContainer}>
            <ChatInput
              onSendMessage={handleSendMessage}
              onFileUpload={handleFileUpload}
              isLoading={isLoading}
              placeholder={isFileUploaded ? "Đặt câu hỏi về tài liệu của bạn..." : "Hãy tải lên tài liệu trước (📎) rồi đặt câu hỏi..."}
            />
          </div>
        </div>
      </div>
    </>
  );
}
