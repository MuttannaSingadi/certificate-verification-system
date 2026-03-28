import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import CertificateCard from "../components/CertificateCard";

export default function CertificateDetails() {

    const { state } = useLocation();
    const navigate = useNavigate();

    if (!state) {
        return (
            <>
                <Navbar />
                <div style={{ textAlign: "center", marginTop: "50px" }}>
                    <h2>No Certificate Data Found</h2>
                    <button onClick={() => navigate("/")}>
                        Go Back
                    </button>
                </div>
            </>
        );
    }

    return (
        <>
            
            <CertificateCard data={state} />
        </>
    );
}