import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/search.css";

export default function SearchCertificate() {

    const [certificateId, setCertificateId] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.state?.certificateId) {
            const id = location.state.certificateId;
            setCertificateId(id);
            handleSearch(id);
        }
    }, [location.state]);

    const handleSearch = async (idParam) => {

        const id = idParam || certificateId;

        if (!id) {
            setError("⚠️ Please enter a valid Certificate ID");
            return;
        }

        setLoading(true);
        setError("");
        setResult(null);

        try {
            const res = await fetch(
                `https://certificate-verification-system-tpcf.onrender.com/api/certificates/${id}`
            );

            if (!res.ok) {
                setError("❌ Certificate not found. Please check the ID.");
                setLoading(false);
                return;
            }

            const data = await res.json();
            setResult(data);

        } catch (error) {
            console.log(error);
            setError("⚠️ Server error. Please try again later.");
        }

        setLoading(false);
    };

    return (
        <>
            <Navbar />

            <div className="search-container">

                <h2>🎓 Certificate Verification Portal</h2>

                <p className="subtitle">
                    Verify the authenticity of your certificate instantly using a unique ID.
                </p>

                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Enter Certificate ID (e.g., CERT12345)"
                        value={certificateId}
                        onChange={(e) => setCertificateId(e.target.value)}
                    />

                    <button onClick={() => handleSearch()}>
                        🔍 Verify Now
                    </button>
                </div>

                {loading && <p className="loading">⏳ Verifying certificate, please wait...</p>}
                {error && <p className="error">{error}</p>}

                {!loading && !result && !error && (
                    <p className="info-text">
                        💡 Tip: Enter the exact certificate ID provided to you.
                    </p>
                )}

                {result && (
                    <div className="result-card">

                        <h3>✅ Certificate Verified Successfully</h3>

                        <p><b>👤 Name:</b> {result.name}</p>
                        <p><b>📧 Email:</b> {result.email}</p>
                        <p><b>📘 Course:</b> {result.course}</p>
                        <p><b>🆔 Certificate ID:</b> {result.certificateId}</p>

                        {/* 🔥 NEW DETAILS (if available in backend) */}
                        <p><b>🏫 Issued By:</b> {result.issuer || "Verified Authority"}</p>
                        <p><b>📅 Issue Date:</b> {result.issueDate || "Not Available"}</p>
                        <p><b>✔ Status:</b> Valid & Authentic</p>

                        <button 
                            className="view-btn"
                            onClick={() => navigate("/certificate", { state: result })}
                        >
                            📄 View Full Certificate
                        </button>

                    </div>
                )}

                {/* 🔐 SECURITY INFO */}
                <div className="info-box">
                    <h4>🔐 Security Assurance</h4>
                    <p>
                        This system ensures certificates are verified against official records.
                        Any mismatch indicates a potentially invalid certificate.
                    </p>
                </div>

                {/* 📌 HELP SECTION */}
                <div className="help-box">
                    <h4>❓ Need Help?</h4>
                    <p>
                        If you are unable to verify your certificate, please contact support
                        or check if the certificate ID is entered correctly.
                    </p>
                </div>

            </div>
        </>
    );
}