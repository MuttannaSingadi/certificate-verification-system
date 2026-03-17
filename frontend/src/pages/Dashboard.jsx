import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";
export default function Dashboard(){

  const navigate = useNavigate();

  return(

    <>
    <Navbar/>

    <div className="dashboard">

      <h1>Admin Dashboard</h1>

      <div className="dashboard-cards">

        <div className="card" onClick={()=>navigate("/upload-students")}>
          <h3>Upload Students</h3>
          <p>Upload Excel file of students</p>
        </div>

        <div className="card" onClick={()=>navigate("/generate-certificate")}>
          <h3>Generate Certificates</h3>
          <p>Create certificates for students</p>
        </div>

        <div className="card" onClick={()=>navigate("/search-certificate")}>
          <h3>Search Certificate</h3>
          <p>Verify certificate by ID</p>
        </div>

      </div>

    </div>
    </>
  )
}