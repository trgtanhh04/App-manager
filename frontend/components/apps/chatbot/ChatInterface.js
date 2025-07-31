import { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaRobot, FaUser } from 'react-icons/fa';
import styles from '../../../styles/apps/chatbot/ChatInterface.module.css';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

export default function ChatInterface({ 
  messages, 
  onSendMessage, 
  isLoading, 
  sessionId,
  isFileUploaded 
}) {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Debug log
  console.log('ChatInterface - isFileUploaded:', isFileUploaded, 'isLoading:', isLoading);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Auto focus input when file is uploaded
  useEffect(() => {
    if (isFileUploaded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFileUploaded]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      if (isFileUploaded) {
        onSendMessage(message.trim(), sessionId);
        setMessage('');
      } else {
        alert('Please upload a document first or use test mode!');
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };


  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        <div className={styles.headerInfo}>
          <FaRobot className={styles.botIcon} />
          <div>
            <h3 className={styles.botName}>AI Assistant</h3>
            <p className={styles.botStatus}>
              {isFileUploaded ? 'Ready to answer questions about your document' : 'Please upload a document first'}
            </p>
          </div>
        </div>
      </div>

      <div className={styles.messagesContainer}>
        {messages.length === 0 && isFileUploaded && (
          <div className={styles.welcomeMessage}>
            <FaRobot className={styles.welcomeIcon} />
            <h4>Welcome! Your document has been processed.</h4>
            <p>Ask me anything about the content you uploaded.</p>
          </div>
        )}

        {messages.map((msg, index) => (
          <MessageBubble 
            key={index}
            message={msg.content}
            isUser={msg.role === 'user'}
            timestamp={msg.timestamp}
          />
        ))}

        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className={styles.inputForm}>
        <div className={styles.inputContainer}>
          <textarea
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            onClick={handleInputClick}
            placeholder={
              isFileUploaded 
                ? "Ask a question about your document..." 
                : "Upload a document first to start chatting"
            }
            className={styles.messageInput}
            disabled={isLoading}
            rows={1}
          />
          <button 
            type="submit" 
            className={styles.sendButton}
            disabled={!message.trim() || isLoading}
          >
            <FaPaperPlane />
          </button>
        </div>
        
        <div className={styles.inputHint}>
          <p>Press Enter to send, Shift+Enter for new line</p>
        </div>
      </form>
    </div>
  );
}
