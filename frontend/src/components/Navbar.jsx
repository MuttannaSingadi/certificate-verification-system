import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import "../styles/navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully 👋");
    navigate("/login", { replace: true });
    setMenuOpen(false);
  };

  const handleVerifyClick = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.warning("Please login to continue 🔐");
      navigate("/login");
      return;
    }

    navigate("/SearchCertificate");
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">

      <div className="logo">
        <img src="/logo_1.png" alt="logo" />
      </div>

      <div
        className="menu-icon"
        onClick={() => setMenuOpen(prev => !prev)}
      >
        {menuOpen ? "☰" : "☰"}
      </div>

      <ul className={`nav-links ${menuOpen ? "active" : ""}`}>

        <li>
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
        </li>

        <li>
          <button onClick={handleVerifyClick} className="nav-btn">
            Verify
          </button>
        </li>

        {user?.role === "admin" && (
          <li>
            <Link to="/admindashboard" onClick={() => setMenuOpen(false)}>
              Admin
            </Link>
          </li>
        )}

        {user && user.role !== "admin" && (
          <li>
            <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
              User
            </Link>
          </li>
        )}

        {user ? (
          <li>
            <button onClick={handleLogout} className="nav-btn logout">
              Logout
            </button>
          </li>
        ) : (
          <>
            <li>
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
            </li>
            <li>
              <Link to="/register" onClick={() => setMenuOpen(false)}>
                Register
              </Link>
            </li>
          </>
        )}

      </ul>

    </nav>
  );
}