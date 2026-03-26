import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully 👋");
    navigate("/login", { replace: true });
  };

  const handleVerifyClick = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.warning("Please login to continue 🔐");
      navigate("/login");
      return;
    }

    navigate("/SearchCCertificate");
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <img src="/logo_1.png" alt="logo" />
      </div>

      <div
        className="menu-icon"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </div>

      <ul className={menuOpen ? "nav-links active" : "nav-links"}>
        <li><Link to="/">Home</Link></li>

        <li>
          <Link className="nav-btn" onClick={handleVerifyClick}>
            Verify
          </Link>
        </li>

        {user?.role === "admin" && (
          <li><Link to="/admindashboard">Admin</Link></li>
        )}

        {user ? (
          <>
            <li><Link to="/dashboard">Dashboard</Link></li>
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