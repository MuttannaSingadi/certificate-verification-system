import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/navbar.css";

export default function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  // 🔒 LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  // 🔒 VERIFY PROTECTION
  const handleVerifyClick = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("⚠️ Please login first");
      navigate("/login");
      return;
    }

    navigate("/searchcertificate");
  };

  return (
    <nav className="navbar">

      <div className="logo">
        <img src="/logo_1.png" alt="logo" />
      </div>

      {/* MENU ICON */}
      <div 
        className="menu-icon"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </div>

      <ul className={menuOpen ? "nav-links active" : "nav-links"}>

        <li><Link to="/">Home</Link></li>

        {/* 🔥 VERIFY FIXED */}
        <li>
          <Link className="nav-btn" onClick={handleVerifyClick}>
            Verify
          </Link>
        </li>

        {/* ADMIN LINK */}
        {user?.role === "admin" && (
          <li><Link to="/admindashboard"></Link></li>
        )}

        {/* USER LINKS */}
        {user ? (
          <>
            <li><Link to="/dashboard"></Link></li>
            <li>
              <Link className="nav-btn logout" onClick={handleLogout}>
                Logout
              </Link>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}

      </ul>

    </nav>
  );
}