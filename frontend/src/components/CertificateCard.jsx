import "../styles/certificate.css";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef } from "react";

export default function CertificateCard({ data }) {

    const certRef = useRef();

    if (!data) return null;

    const formattedDate =
        data.completionDate
            ? new Date(data.completionDate).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "long",
                year: "numeric"
            })
            : data.issueDate
                ? new Date(data.issueDate).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric"
                })
                : "N/A";

    const handleDownload = async () => {
        const element = certRef.current;

        const originalWidth = element.style.width;
        element.style.width = "950px";

        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            scrollY: -window.scrollY
        });

        element.style.width = originalWidth;

        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("landscape", "mm", "a4");

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const imgRatio = canvas.width / canvas.height;
        const pageRatio = pdfWidth / pdfHeight;

        let imgWidth, imgHeight;

        if (imgRatio > pageRatio) {
            imgWidth = pdfWidth;
            imgHeight = pdfWidth / imgRatio;
        } else {
            imgHeight = pdfHeight;
            imgWidth = pdfHeight * imgRatio;
        }

        const x = (pdfWidth - imgWidth) / 2;
        const y = (pdfHeight - imgHeight) / 2;

        pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);
        pdf.save(`${data.name}_certificate.pdf`);
    };

    return (
        <div className="certificate-container">

            <div className="certificate-card" ref={certRef}>

                {/* ✅ HEADER FIXED */}
                <div className="cert-header">
                    <img src="/logo_1.png" className="cert-logo" />

                    <div className="cert-title">
                        <h1>Certificate of Completion</h1>
                        <p>This is to certify that</p>
                    </div>
                </div>

                <h2 className="cert-name">{data.name}</h2>

                <p className="cert-text">has successfully completed</p>

                <h3 className="cert-course">{data.course}</h3>

                <p className="cert-date">
                    Completion Date: <b>{formattedDate}</b>
                </p>

                <div className="watermark">SECURECERT</div>

                <div className="cert-footer">

                    <div className="left">
                        <QRCodeCanvas
                            value={`https://certificate-verification-system-black.vercel.app/verify/${data.certificateId}`}
                            size={100}
                        />
                        <p>Scan to Verify</p>
                    </div>

                    <div className="center">
                        <p>ID: {data.certificateId}</p>
                        <p>{data.email}</p>
                    </div>

                    <div className="right">
                        <img src="/signature.png" alt="sign" />
                        <p>Authorized Signature</p>
                    </div>

                </div>

                <div className="verified">✔ Verified Certificate</div>

            </div>

            <div className="actions">
                <button onClick={handleDownload}>Download PDF</button>
                <button onClick={() => window.print()}>Print</button>
            </div>

        </div>
    );
}