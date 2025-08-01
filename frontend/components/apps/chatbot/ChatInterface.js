import { useRef, useEffect } from 'react';
import { FaRobot } from 'react-icons/fa';
import styles from '../../../styles/apps/chatbot/ChatInterface.module.css';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

export default function ChatInterface({ 
  messages, 
  isLoading, 
  error
}) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className={styles.messagesContainer}>
      {messages.length === 0 && (
        <div className={styles.welcomeMessage}>
          <FaRobot className={styles.welcomeIcon} />
          <h4>Chào bạn! Tôi có thể giúp gì cho bạn?</h4>
          <p>📎 Hãy tải lên một tài liệu (PDF, DOCX, TXT...) và đặt câu hỏi về nội dung của nó!</p>
          <p style={{marginTop: '8px', fontSize: '12px', color: '#9ca3af'}}>
            Hoặc bạn có thể chat trực tiếp với tôi về bất kỳ chủ đề nào.
          </p>
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
      
      {error && (
        <div className={styles.errorMessage}>
          <p>{error}</p>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
}
