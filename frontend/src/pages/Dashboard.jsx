import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

export default function Dashboard() {

  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <div className="dashboard">

        <h1>Admin Dashboard</h1>

        <p className="dashboard-subtitle">
          Manage student certificates and verification system
        </p>

        <div className="dashboard-cards">

          <div 
            className="card"
            onClick={() => navigate("/UploadStudents")}
          >
            <h3>Upload Students</h3>
            <p>Upload Excel file containing student data</p>
          </div>

          <div 
            className="card"
            onClick={() => navigate("/generate-certificate")}
          >
            <h3>Generate Certificates</h3>
            <p>Create certificates for uploaded students</p>
          </div>

          <div 
            className="card"
            onClick={() => navigate("/search-certificate")}
          >
            <h3>Search Certificate</h3>
            <p>Verify certificate using ID</p>
          </div>

        </div>

      </div>
    </>
  );
}