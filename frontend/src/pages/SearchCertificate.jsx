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

    // ✅ AUTO LOAD FROM HOME PAGE
    useEffect(() => {
        if (location.state?.certificateId) {
            const id = location.state.certificateId;
            setCertificateId(id);
            handleSearch(id);
        }
    }, [location.state]);

    // ✅ SEARCH FUNCTION
    const handleSearch = async (idParam) => {

        const id = idParam || certificateId;

        if (!id) {
            setError("⚠️ Please enter Certificate ID");
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
                setError("❌ Certificate not found");
                setLoading(false);
                return;
            }

            const data = await res.json();

            // ✅ OPTION 1: show here
            setResult(data);

            // ✅ OPTION 2 (BETTER UX): go to certificate page
            // navigate("/certificate", { state: data });

        } catch (error) {
            console.log(error);
            setError("⚠️ Error fetching certificate");
        }

        setLoading(false);
    };

    return (
        <>
            <Navbar />

            <div className="search-container">

                <h2>🎓 Verify Certificate</h2>

                <p className="subtitle">
                    Enter your certificate ID to check authenticity instantly.
                </p>

                <div className="search-box">

                    <input
                        type="text"
                        placeholder="Enter Certificate ID (e.g., CERT12345)"
                        value={certificateId}
                        onChange={(e) => setCertificateId(e.target.value)}
                    />

                    <button onClick={() => handleSearch()}>
                        🔍 Verify
                    </button>

                </div>

                {loading && <p className="loading">⏳ Verifying...</p>}
                {error && <p className="error">{error}</p>}

                {result && (
                    <div className="result-card">

                        <h3>✅ Certificate Verified</h3>

                        <p><b>👤 Name:</b> {result.name}</p>
                        <p><b>📧 Email:</b> {result.email}</p>
                        <p><b>📘 Course:</b> {result.course}</p>
                        <p><b>🆔 Certificate ID:</b> {result.certificateId}</p>

                        {/* 🔥 EXTRA BUTTON */}
                        <button 
                            className="view-btn"
                            onClick={() => navigate("/certificate", { state: result })}
                        >
                            📄 View Full Certificate
                        </button>

                    </div>
                )}

                <div className="info-box">
                    <p>
                        🔐 This system ensures that all certificates are genuine
                        and issued by authorized institutions.
                    </p>
                </div>

            </div>
        </>
    );
}