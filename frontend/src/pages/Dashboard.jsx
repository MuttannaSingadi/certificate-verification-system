import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

export default function Dashboard() {

  const navigate = useNavigate();

  const [certificateId, setCertificateId] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const [history, setHistory] = useState([]);
  const [profile, setProfile] = useState({
    name: "",
    email: ""
  });

  const [menuOpen, setMenuOpen] = useState(false);

  const API = "https://certificate-verification-system-tpcf.onrender.com/api/certificates";

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || ""
      });
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".dashboard-navbar")) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ FIXED FUNCTION
  const handleSearch = async () => {
    try {
      setError("");
      setResult(null);

      if (!certificateId.trim()) {
        setError("⚠️ Please enter Certificate ID");
        return;
      }

      const token = localStorage.getItem("token");

      if (!token) {
        setError("⚠️ Please login first");
        return;
      }

      const res = await fetch(`${API}/${certificateId}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await res.json();

      console.log("API DATA:", data);

      if (data?.message === "No token") {
        setError("⚠️ Unauthorized. Please login again");
        return;
      }

      if (!res.ok || !data) {
        setError("❌ Certificate not found");
        return;
      }

      setResult(data);
      setHistory((prev) => [data, ...prev]);

    } catch (err) {
      console.error(err);
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

  const handleDelete = (index) => {
    setHistory((prev) => prev.filter((_, i) => i !== index));
  };

  const handleProfileChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileUpdate = () => {
    if (!profile.name || !profile.email) {
      alert("Please fill all fields");
      return;
    }

    localStorage.setItem("user", JSON.stringify(profile));
    alert("✅ Profile Updated Successfully");
  };

  const Navbar = () => (
    <div className="dashboard-navbar-wrapper">
      <div className="dashboard-navbar">

        <div className="logo">🎓 User Dashboard</div>

        <div className="menu-icon" onClick={() => setMenuOpen(prev => !prev)}>
          ☰
        </div>

        <div className={`nav-links ${menuOpen ? "active" : ""}`}>
          <button onClick={() => {
            navigate("/");
            setMenuOpen(false);
          }}>
            Home
          </button>

          <button onClick={() => {
            setResult(null);
            setCertificateId("");
            setError("");
            setMenuOpen(false);
          }}>
            Clear
          </button>

          <button className="logout" onClick={() => {
            handleLogout();
            setMenuOpen(false);
          }}>
            Logout
          </button>
        </div>
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

        <div className="profile-section">
          <h2>👤 Update Profile</h2>

          <div className="profile-form">
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleProfileChange}
            />

            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleProfileChange}
            />

            <button onClick={handleProfileUpdate}>
              Update
            </button>
          </div>
        </div>

        <div className="stats-section">
          <div className="stat-card">
            <h4>Total Verified</h4>
            <p>{history.length}</p>
          </div>

          <div className="stat-card">
            <h4>Certificates Found</h4>
            <p>{history.length}</p>
          </div>

          <div className="stat-card">
            <h4>Last Verified</h4>
            <p>{history[0]?.certificateId || "None"}</p>
          </div>
        </div>

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

            <p><strong>Status:</strong> <span style={{ color: "green" }}>✔ Verified</span></p>
            <p><strong>Issued By:</strong> SecureCert Authority</p>
            <p><strong>Verified On:</strong> {new Date().toLocaleString()}</p>

            <button onClick={handleDownload} className="download-btn">
              ⬇️ Download Certificate
            </button>
          </div>
        )}

        {history.length > 0 && (
          <div className="history-section">
            <h2>📜 Verification History</h2>

            {history.map((item, index) => (
              <div key={index} className="history-card">
                <div>
                  <p><strong>{item.name}</strong></p>
                  <p>ID: {item.certificateId}</p>
                  <p>Course: {item.course}</p>
                </div>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(index)}
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
        )}

        {history.length > 0 && (
          <div className="activity-section">
            <h2>🔔 Recent Activity</h2>
            <p>✔ Verified certificate {history[0]?.certificateId}</p>
            <p>📘 Course: {history[0]?.course}</p>
            <p>🕒 {new Date().toLocaleString()}</p>
          </div>
        )}

      </div>
    </>
  );
}