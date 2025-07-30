import { FaStar } from "react-icons/fa";
import styles from "../styles/RatingCard.module.css";

export default function RatingCard({ rating, trend }) {
  return (
    <div className={styles.ratingCard}>
      <h3 className={styles.title}>Rating</h3>
      
      <div className={styles.ratingContainer}>
        <div className={styles.ratingValue}>
          {rating}
        </div>
        
        <div className={styles.ratingTrend}>
          <FaStar className={styles.starIcon} />
          <span className={styles.trendText}>
            {trend}
          </span>
        </div>
      </div>
    </div>
  );
}
