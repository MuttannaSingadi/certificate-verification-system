import { useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/search.css";

export default function SearchCertificate() {

    const [certificateId, setCertificateId] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSearch = async () => {

        if (!certificateId) {
            setError("⚠️ Please enter Certificate ID");
            return;
        }

        setLoading(true);
        setError("");
        setResult(null);

        try {
            const res = await fetch(
                `https://certificate-verification-system-tpcf.onrender.com/api/certificates/${certificateId}`
            );

            if (!res.ok) {
                setError("❌ Certificate not found");
                setLoading(false);
                return;
            }

            const data = await res.json();
            setResult(data);

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

                    <button onClick={handleSearch}>
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