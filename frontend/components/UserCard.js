import styles from "../styles/UserCard.module.css";

export default function UserCard({ users }) {
  return (
    <div className={styles.userCard}>
      <h3 className={styles.title}>Recent Users</h3>
      
      <div className={styles.userList}>
        {users.map((user, index) => (
          <div key={index} className={styles.userItem}>
            <div className={styles.userInfo}>
              <div 
                className={styles.avatar}
                style={{
                  background: user.avatar || `linear-gradient(135deg, ${user.color1 || '#00d4ff'}, ${user.color2 || '#0099cc'})`
                }}
              >
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className={styles.avatarImage} />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
              </div>
              <div className={styles.userDetails}>
                <div className={styles.userName}>
                  {user.name}
                </div>
                <div className={styles.userDescription}>
                  {user.description}
                </div>
              </div>
            </div>
            
            <div className={styles.userActions}>
              <span className={styles.userTime}>
                {user.time}
              </span>
              <div className={styles.buttonGroup}>
                <button className={styles.rejectBtn}>
                  Reject
                </button>
                <button className={styles.approveBtn}>
                  Approve
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
