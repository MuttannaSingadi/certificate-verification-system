import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/search.css";

export default function GenerateCertificate() {

    const [certificateId, setCertificateId] = useState("");
    const navigate = useNavigate();

    const handleGenerate = async () => {

        if (!certificateId) {
            alert("Enter Certificate ID");
            return;
        }

        try {
            const res = await fetch(
                `https://certificate-verification-system-tpcf.onrender.com/api/certificates/${certificateId}`
            );

            if (!res.ok) {
                alert("Certificate not found");
                return;
            }

            const data = await res.json();

            navigate("/certificate", { state: data });

        } catch (error) {
            alert("Error fetching certificate");
        }
    };

    return (
        <>
            <Navbar />

            <div className="search-container">

                <h2>🎓 Generate Certificate</h2>

                <p className="subtitle">
                    Enter your Certificate ID to view your certificate
                </p>

                <div className="search-box">

                    <input
                        type="text"
                        placeholder="Enter Certificate ID"
                        value={certificateId}
                        onChange={(e) => setCertificateId(e.target.value)}
                    />
                    <div className="info-section">
                        <p>🔐 Secure & Verified Certificates</p>
                        <p>⚡ Instant Verification</p>
                        <p>🌐 Trusted by Institutions</p>
                    </div>

                    <button onClick={handleGenerate}>
                        🚀 Generate
                    </button>

                </div>

            </div>
        </>
    );
}