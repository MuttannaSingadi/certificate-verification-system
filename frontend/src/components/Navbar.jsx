import { Link } from "react-router-dom";
import { useState } from "react";
import "./navbar.css";

export default function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">

      <div className="logo">
        <img src="/logo_1.png" alt="logo" />
      </div>

      {/* HAMBURGER BUTTON */}
      <div 
        className="menu-icon"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </div>

      {/* NAV LINKS */}
      <ul className={menuOpen ? "nav-links active" : "nav-links"}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/search">Verify</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/register">Register</Link></li>
      </ul>

    </nav>
  );
}