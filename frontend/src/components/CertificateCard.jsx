import "../styles/certificate.css";
import { QRCodeCanvas } from "qrcode.react";

export default function CertificateCard({ data }) {

    if (!data) return null; // safety check

    return (
        <div className="certificate-container">

            <div className="certificate-card">

                {/* Top Logo */}
                <div className="cert-header">
                    <div className="logo">
                        <img src="/logo_1.png" alt="logo" />
                    </div>
                </div>

                <h1 className="cert-title">Certificate of Completion</h1>

                <p className="cert-text">This is to certify that</p>

                <h2 className="cert-name">{data.name}</h2>

                <p className="cert-text">has successfully completed</p>

                <h3 className="cert-course">{data.course}</h3>

                <p className="cert-id">
                    Certificate ID: <b>{data.certificateId}</b>
                </p>

                <p className="cert-email">{data.email}</p>

                {/* QR Code */}
                <div className="qr-section">
                    <QRCodeCanvas
                        value={`https://certificate-verification-system-black.vercel.app/verify/${data.certificateId}`}
                        size={90}
                    />
                </div>

                {/* Footer */}
                <div className="cert-footer">

                    <div className="signature">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/8/89/Signature_example.png"
                            alt="sign"
                        />
                        <p>Authorized Signature</p>
                    </div>

                    <div className="seal">
                        🏅 Verified
                    </div>

                </div>

                {/* Actions */}
                <div className="actions">
                    <button onClick={() => window.print()}>
                        🖨️ Print
                    </button>
                </div>

            </div>

        </div>
    );
}