import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

export default function Dashboard() {

  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <div className="dashboard">

        <h1>📊 Student Dashboard</h1>

        <p className="dashboard-subtitle">
          Manage student certificates and verification system
        </p>

        <div className="dashboard-cards">

          {/* Upload Students */}
          <div 
            className="card"
            onClick={() => navigate("/uploadstudents")}   // ✅ FIXED
          >
            <h3>📤 Upload Students</h3>
            <p>Upload Excel file containing student data</p>
          </div>

          {/* Generate Certificates */}
          <div 
            className="card"
            onClick={() => navigate("/generatecertificate")}
          >
            <h3>🎓 Generate Certificates</h3>
            <p>Create certificates for uploaded students</p>
          </div>

          {/* Search Certificate */}
          <div 
            className="card"
            onClick={() => navigate("/searchcertificate")}  // ✅ FIXED
          >
            <h3>🔍 Search Certificate</h3>
            <p>Verify certificate using ID</p>
          </div>

        </div>

      </div>
    </>
  );
}