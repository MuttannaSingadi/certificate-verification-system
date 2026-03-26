import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

export default function Dashboard() {

  const navigate = useNavigate();

  const [certificateId, setCertificateId] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const API = "https://certificate-verification-system-tpcf.onrender.com/api/certificates";

  const handleSearch = async () => {
    try {
      setError("");
      setResult(null);

      if (!certificateId.trim()) {
        setError("⚠️ Please enter Certificate ID");
        return;
      }

      const res = await fetch(`${API}/${certificateId}`);
      const data = await res.json();

      if (!data || data.message) {
        setError("❌ Certificate not found");
      } else {
        setResult(data);
      }

    } catch {
      setError("⚠️ Server error");
    }
  };

  const handleDownload = () => {
    if (!result) return;
    navigate("/certificate", { state: result });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  const Navbar = () => (
    <div className="dashboard-navbar">
      <div className="logo">🎓 User Dashboard</div>

      <div className="nav-links">
        <button onClick={() => navigate("/")}>Home</button>

        <button onClick={() => {
          setResult(null);
          setCertificateId("");
          setError("");
        }}>
          Clear
        </button>

        <button className="logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      <Navbar />

      <div className="dashboard">

        <h1>🎓 Certificate Verification</h1>
        <p className="dashboard-subtitle">
          Search and verify your certificate instantly
        </p>

        <div className="search-box">
          <input
            type="text"
            placeholder="Enter Certificate ID"
            value={certificateId}
            onChange={(e) => setCertificateId(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        {error && <div className="error">{error}</div>}

        {result && (
          <div className="result-card">
            <h3>✅ Certificate Verified</h3>

            <p><strong>Name:</strong> {result.name}</p>
            <p><strong>Email:</strong> {result.email}</p>
            <p><strong>Course:</strong> {result.course}</p>
            <p><strong>ID:</strong> {result.certificateId}</p>

            <p>
              <strong>Date:</strong>{" "}
              {result.completionDate
                ? new Date(result.completionDate).toLocaleDateString()
                : result.issueDate
                  ? new Date(result.issueDate).toLocaleDateString()
                  : "No Date"}
            </p>

            {/* 🔥 EXTRA INFO */}
            <p><strong>Status:</strong> <span style={{ color: "green" }}>✔ Verified</span></p>
            <p><strong>Issued By:</strong> SecureCert Authority</p>
            <p><strong>Verified On:</strong> {new Date().toLocaleString()}</p>
            <p><strong>Description:</strong> This certificate confirms successful completion of the course.</p>

            <button onClick={handleDownload} className="download-btn">
              ⬇️ Download Certificate
            </button>
          </div>
        )}

      </div>
    </>
  );
}