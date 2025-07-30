import styles from "../styles/Card.module.css";
import { useRouter } from 'next/router';

export default function Card({ 
  title, 
  value, 
  percentage, 
  color, 
  icon, 
  subtitle, 
  target, 
  duration, 
  progressPercent = 70,
  onClick,
  style,
  appId, // Add appId prop for navigation
  enableNavigation = false // Flag to enable navigation
}) {
  const router = useRouter();
  const isNegative = percentage && percentage.startsWith('-');
  const percentageClass = isNegative ? styles.negative : styles.positive;
  
  const handleClick = () => {
    if (enableNavigation && appId) {
      router.push(`/app/${appId}`);
    } else if (onClick) {
      onClick();
    }
  };
  
  return (
    <div 
      className={`${styles.card} ${(onClick || enableNavigation) ? styles.clickable : ''}`}
      onClick={handleClick}
      style={style}
    >
      {/* Progress bar at bottom */}
      <div 
        className={styles.progressBar}
        style={{
          width: `${progressPercent}%`,
          background: color || "#00d4ff"
        }}
      ></div>
      
      <div className={styles.cardHeader}>
        <div className={styles.cardContent}>
          <p className={styles.cardTitle}>{title}</p>
          <h2 className={styles.cardValue}>{value}</h2>
          {percentage && (
            <span className={`${styles.cardPercentage} ${percentageClass}`}>
              {percentage} {subtitle || "Total Likes"}
            </span>
          )}
        </div>
        <div 
          className={styles.cardIcon}
          style={{ color: color || "#00d4ff" }}
        >
          {icon}
        </div>
      </div>
      
      {/* Target and Duration info */}
      {(target || duration) && (
        <div className={styles.cardFooter}>
          {target && (
            <div className={styles.cardTarget}>
              <span className={styles.footerLabel}>Target:</span>
              <span className={styles.footerValue}>
                {target}
              </span>
            </div>
          )}
          {duration && (
            <div className={styles.cardDuration}>
              <span className={styles.footerLabel}>Duration:</span>
              <span className={styles.footerValue}>
                {duration}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
