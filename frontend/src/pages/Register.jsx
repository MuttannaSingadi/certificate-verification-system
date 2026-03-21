import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/register.css";

export default function Register() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student"
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(
        "https://certificate-verification-system-tpcf.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: formData.role
          })
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert(data.message || "Registration successful");
      } else {
        alert(data.message || "Registration failed");
      }

    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <>
      <Navbar />

      <div className="register-container">

        <div className="register-card">

          <h2>Create Account</h2>

          <form onSubmit={handleSubmit}>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <button type="submit">Register</button>

          </form>

          <p className="login-link">
            Already have an account? <Link to="/login">Login</Link>
          </p>

        </div>

      </div>
    </>
  );
}