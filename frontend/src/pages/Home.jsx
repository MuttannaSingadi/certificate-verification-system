import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/home.css";

export default function Home() {

  const [certificateId, setCertificateId] = useState("");
  const navigate = useNavigate();

  const handleVerify = () => {
    if (!certificateId.trim()) {
      alert("Enter certificate ID");
      return;
    }

    // ✅ pass data using state
    navigate("/searchCertificate", { state: { certificateId } });
  };

  return (
    <>
      <Navbar />

      <section className="hero">
        <div className="container">
          <h1>Certificate Verification System</h1>

          <p>
            Verify student certificates quickly and securely using our digital platform.
          </p>

          <div className="verify-box">
            <input
              type="text"
              placeholder="Enter Certificate ID"
              value={certificateId}
              onChange={(e) => setCertificateId(e.target.value)}
            />

            <button onClick={handleVerify}>
              Verify Certificate
            </button>
          </div>

        </div>

      </section>

      {/* FEATURES SECTION */}

      <section className="features">

        <div className="feature-card">
          <h3>Secure Verification</h3>
          <p>Ensure certificates are authentic and issued by the institute.</p>
        </div>

        <div className="feature-card">
          <h3>Instant Search</h3>
          <p>Search certificates instantly using certificate ID.</p>
        </div>

        <div className="feature-card">
          <h3>Download Certificate</h3>
          <p>Students can easily download their verified certificates.</p>
        </div>

      </section>

      {/* HOW IT WORKS */}

      <section className="how-it-works">

        <h2>How Verification Works</h2>

        <div className="steps">

          <div className="step">
            <h3>1. Enter Certificate ID</h3>
            <p>Users enter their certificate ID in the verification box.</p>
          </div>

          <div className="step">
            <h3>2. System Validation</h3>
            <p>The system checks the certificate details from the database.</p>
          </div>

          <div className="step">
            <h3>3. Instant Result</h3>
            <p>The certificate authenticity is displayed instantly.</p>
          </div>

        </div>

      </section>

      {/* ABOUT SECTION */}

      <section className="about-system">

        <div className="container">

          <h2>About Our System</h2>

          <p>
            The Certificate Verification System helps institutions issue
            digitally verifiable certificates. Employers, universities, and
            organizations can instantly confirm the authenticity of student
            credentials using a certificate ID.
          </p>

        </div>

      </section>

      {/* FOOTER */}

      <footer className="footer">

        <p>
          © {new Date().getFullYear()} Certificate Verification System
        </p>

      </footer>

    </>
  );
}