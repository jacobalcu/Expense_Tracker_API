import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Navbar() {
  // 1. Initialize your navigator
  const navigate = useNavigate();

  // 2. Grab the logout function from the AuthContext
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    // 3. What two things need to happen when they click this button?
    logout();
    navigate("/login");
  };

  return (
    <nav
      className="navbar"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px",
        paddingBottom: "15px",
        borderBottom: "2px solid #e2e8f0",
      }}
    >
      <h2 style={{ margin: 0, color: "#2c5282" }}>Tracker</h2>
      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <Link
          to="/dashboard"
          style={{
            textDecoration: "none",
            color: "#4a5568",
            fontWeight: "600",
          }}
        >
          Dashboard
        </Link>
        <Link
          to="/analytics"
          style={{
            textDecoration: "none",
            color: "#4a5568",
            fontWeight: "600",
          }}
        >
          Analytics
        </Link>
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 16px",
            backgroundColor: "#e2e8f0",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
            color: "#4a5568",
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
