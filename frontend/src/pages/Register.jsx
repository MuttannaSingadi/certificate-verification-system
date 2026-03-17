import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/register.css";

export default function Register(){

  const [formData,setFormData] = useState({
    name:"",
    email:"",
    password:"",
    confirmPassword:""
  });

  const handleChange = (e)=>{
    setFormData({
      ...formData,
      [e.target.name]:e.target.value
    });
  };

 const handleSubmit = async (e)=>{
  e.preventDefault();

  const res = await fetch("http://localhost:5000/api/auth/register",{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify(formData)
  });

  const data = await res.json();

  alert(data.message);
};

  return(

    <>
    <Navbar/>

    <div className="register-container">

      <div className="register-card">

        <h2>Create Account</h2>

        <form onSubmit={handleSubmit}>

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

          <button type="submit">
            Register
          </button>

        </form>

        <p className="login-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>

      </div>

    </div>

    </>
  )
}