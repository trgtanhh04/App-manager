import Link from "next/link";
import { FaHome } from "react-icons/fa";
import styles from "../styles/Sidebar.module.css";

export default function Sidebar({ prefixAdmin = "" }) {
  return (
    <aside className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.logo}>
        <div className={styles.logoContent}>
          <div className={styles.logoIcon}>
            📊
          </div>
          App Manager
        </div>
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        {/* Navigation Header */}
        <div className={styles.navHeader}>
          NAVIGATION
        </div>
        
        <ul className={styles.navList}>
          <li>
            <Link href={`${prefixAdmin}/`} className={`${styles.navLink} ${styles.active}`}>
              <FaHome className={styles.navIcon} />
              Dashboard
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}