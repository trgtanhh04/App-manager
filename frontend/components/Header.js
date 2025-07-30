// components/Header.js
import Link from "next/link";
import { FaSearch, FaUser, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from '../contexts/AuthContext';

export default function Header({ prefixAdmin = "" }) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    if (onSearch) {
      onSearch('');
    }
  };
  return (
    <header style={{
      background: "#fff",
      borderBottom: "1px solid #e2e8f0",
      padding: "16px 32px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
    }}>
      {/* Left side - Search */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{
          position: "relative",
          display: "flex",
          alignItems: "center"
        }}>
          <FaSearch style={{
            position: "absolute",
            left: "12px",
            color: "#94a3b8",
            fontSize: "14px"
          }} />
          <input 
            type="text" 
            placeholder="Search..."
            style={{
              padding: "8px 12px 8px 32px",
              border: "1px solid #e2e8f0",
              borderRadius: "6px",
              fontSize: "14px",
              width: "300px",
              outline: "none"
            }}
          />
        </div>
      </div>

      {/* Right side - User profile and logout */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {/* User Profile */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "12px"
        }}>
          {/* User Info */}
          <div style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            padding: "4px",
            gap: "8px"
          }}>
            <div style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: "14px",
              fontWeight: "600"
            }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : <FaUser />}
            </div>
            <span style={{
              color: "#374151",
              fontWeight: "500",
              fontSize: "14px"
            }}>
              {user?.name || 'User'}
            </span>
          </div>

          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            style={{
              background: "none",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
              color: "#64748b",
              cursor: "pointer",
              padding: "6px 10px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "14px",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = "#ef4444";
              e.target.style.color = "#ef4444";
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = "#e5e7eb";
              e.target.style.color = "#64748b";
            }}
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
