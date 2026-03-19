import { useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/search.css";

export default function SearchCertificate() {

    const [certificateId, setCertificateId] = useState("");
    const [result, setResult] = useState(null);

    const handleSearch = async () => {

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
            setResult(data);

        } catch (error) {
            console.log(error);
            alert("Error fetching certificate");
        }
    };

    return (
        <>
            <Navbar />

            <div className="search-container">

                <h2>Verify Certificate</h2>

                <div className="search-box">

                    <input
                        type="text"
                        placeholder="Enter Certificate ID"
                        value={certificateId}
                        onChange={(e) => setCertificateId(e.target.value)}
                    />

                    <button onClick={handleSearch}>
                        Verify
                    </button>

                </div>

                {result && (
                    <div className="result-card">

                        <h3>Certificate Details</h3>

                        <p><b>Name:</b> {result.name}</p>
                        <p><b>Email:</b> {result.email}</p>
                        <p><b>Course:</b> {result.course}</p>
                        <p><b>Certificate ID:</b> {result.certificateId}</p>

                    </div>
                )}

            </div>
        </>
    );
}