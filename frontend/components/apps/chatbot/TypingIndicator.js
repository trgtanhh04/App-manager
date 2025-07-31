import { FaRobot } from 'react-icons/fa';
import styles from '../../../styles/apps/chatbot/TypingIndicator.module.css';

export default function TypingIndicator() {
  return (
    <div className={styles.typingWrapper}>
      <div className={styles.typingContainer}>
        <div className={styles.avatar}>
          <FaRobot className={styles.aiIcon} />
        </div>
        
        <div className={styles.typingBubble}>
          <div className={styles.typingText}>
            AI is thinking
            <div className={styles.dots}>
              <span className={styles.dot}></span>
              <span className={styles.dot}></span>
              <span className={styles.dot}></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
