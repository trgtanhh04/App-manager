import { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaComment } from 'react-icons/fa';
import styles from '../../../styles/apps/chatbot/ChatbotPage.module.css';

export default function ChatSidebar({ 
  conversations, 
  activeConversationId, 
  onSelectConversation, 
  onNewConversation,
  onDeleteConversation 
}) {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <div className={styles.chatSidebar}>
      <div className={styles.sidebarHeader}>
        <button 
          className={styles.newChatBtn}
          onClick={onNewConversation}
        >
          <FaPlus size={14} />
          New conversation
        </button>
      </div>
      
      <div className={styles.conversationsList}>
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            className={`${styles.conversationItem} ${
              activeConversationId === conversation.id ? styles.active : ''
            }`}
            onClick={() => onSelectConversation(conversation.id)}
            onMouseEnter={() => setHoveredId(conversation.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <FaComment size={12} />
            <span className={styles.conversationTitle}>
              {conversation.title || 'New conversation'}
            </span>
            {hoveredId === conversation.id && (
              <button
                className={styles.deleteBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteConversation(conversation.id);
                }}
              >
                <FaTrash size={12} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
