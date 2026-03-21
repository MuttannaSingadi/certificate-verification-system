import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
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

    const res = await fetch(
      "https://certificate-verification-system-tpcf.onrender.com/api/auth/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      }
    );

    const data = await res.json();

    if (res.ok) {

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "admin") {
        navigate("/admindashboard");
      } else {
        navigate("/dashboard");
      }

    } else {
      alert(data.message);
    }
  };

  return (
    <>
      <Navbar />

      <form onSubmit={handleSubmit}>
        <input name="email" onChange={handleChange} />
        <input name="password" type="password" onChange={handleChange} />
        <button>Login</button>
      </form>

      <Link to="/register">Register</Link>
    </>
  );
}