import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/login.css";

export default function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "https://certificate-verification-system-tpcf.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        }
      );

      const data = await res.json();

      console.log("LOGIN RESPONSE:", data); // ✅ DEBUG

      if (res.ok && data.token) {

        // ✅ STORE TOKEN SAFELY
        localStorage.setItem("token", data.token);

        // ✅ STORE USER
        localStorage.setItem("user", JSON.stringify(data.user));

        console.log("TOKEN SAVED:", localStorage.getItem("token")); // ✅ CHECK

        // ✅ NAVIGATION
        if (data.user?.role === "admin") {
          navigate("/admindashboard");
        } else {
          navigate("/dashboard");
        }

      } else {
        alert(data.message || "Login failed");
      }

    } catch (error) {
      console.error("LOGIN ERROR:", error);
      alert("Server error");
    }
  };

  return (
    <>
      <div className="login-container">

        <div className="login-card">

          <h2>Login</h2>

          <form onSubmit={handleSubmit}>

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

            <button type="submit">Login</button>

          </form>

          <p className="register-link">
            Don't have an account? <Link to="/register">Register</Link>
          </p>

        </div>

      </div>
    </>
  );
}