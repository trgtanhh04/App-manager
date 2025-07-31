import { FaUser, FaRobot } from 'react-icons/fa';
import styles from '../../../styles/apps/chatbot/MessageBubble.module.css';

export default function MessageBubble({ message, isUser, timestamp }) {
  const formatTime = (time) => {
    if (!time) return '';
    const date = new Date(time);
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`${styles.messageWrapper} ${isUser ? styles.userMessage : styles.aiMessage}`}>
      <div className={styles.messageContainer}>
        <div className={styles.avatar}>
          {isUser ? (
            <FaUser className={styles.userIcon} />
          ) : (
            <FaRobot className={styles.aiIcon} />
          )}
        </div>
        
        <div className={styles.messageContent}>
          <div className={styles.messageBubble}>
            <p className={styles.messageText}>{message}</p>
          </div>
          {timestamp && (
            <span className={styles.timestamp}>
              {formatTime(timestamp)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
