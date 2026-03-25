import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ added
import "../styles/admin.css";
import * as XLSX from "xlsx";

export default function AdminDashboard() {

    const navigate = useNavigate(); // ✅ added

    const [form, setForm] = useState({
        name: "",
        email: "",
        course: "",
        certificateId: "",
        completionDate: ""
    });

    const [certificates, setCertificates] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [originalId, setOriginalId] = useState(null);
    const [search, setSearch] = useState("");

    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [message, setMessage] = useState("");

    const API = "https://certificate-verification-system-tpcf.onrender.com/api/certificates";

    useEffect(() => {
        fetchCertificates();
    }, []);

    const fetchCertificates = async () => {
        try {
            const res = await fetch(API);
            const data = await res.json();
            setCertificates(data);
        } catch {
            console.error("Error fetching data");
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        });

        setMessage("✅ Certificate added successfully");
        fetchCertificates();
        resetForm();

        setTimeout(() => setMessage(""), 2000);
    };

    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setShowConfirm(true);
    };

    const confirmDelete = async () => {
        await fetch(`${API}/${deleteId}`, { method: "DELETE" });

        setMessage("❌ Certificate deleted successfully");

        setShowConfirm(false);
        setDeleteId(null);
        fetchCertificates();

        setTimeout(() => setMessage(""), 2000);
    };

    const cancelDelete = () => {
        setShowConfirm(false);
        setDeleteId(null);
    };

    const handleEdit = (cert) => {
        setForm({
            ...cert,
            completionDate: cert.completionDate
                ? cert.completionDate.split("T")[0]
                : ""
        });
        setOriginalId(cert.certificateId);
        setIsEditing(true);
    };

    const handleUpdate = async () => {
        await fetch(`${API}/${originalId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        });

        setMessage("✏️ Certificate updated successfully");
        fetchCertificates();
        resetForm();

        setTimeout(() => setMessage(""), 2000);
    };

    const resetForm = () => {
        setForm({
            name: "",
            email: "",
            course: "",
            certificateId: "",
            completionDate: ""
        });
        setOriginalId(null);
        setIsEditing(false);
    };

    const exportExcel = () => {
        const ws = XLSX.utils.json_to_sheet(certificates);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Certificates");
        XLSX.writeFile(wb, "certificates.xlsx");
    };

    const filtered = certificates.filter(cert =>
        cert.name.toLowerCase().includes(search.toLowerCase()) ||
        cert.certificateId.toLowerCase().includes(search.toLowerCase())
    );

    // ✅ LOGOUT FUNCTION
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/", { replace: true });
    };

    // ✅ NAVBAR
    const AdminNavbar = () => {
        return (
            <div className="admin-navbar">
                <div className="logo">🎓 Admin Panel</div>

                <div className="nav-links">
                    <button onClick={fetchCertificates}>Dashboard</button>
                    <button onClick={exportExcel}>Export</button>
                    <button onClick={resetForm}>Clear</button>
                    <button className="logout" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
        );
    };

    return (
        <>
            <AdminNavbar />

            <div className="admin-container">

                {message && <div className="success-msg">{message}</div>}

                <h2>🛠 Admin Dashboard</h2>

                <div className="admin-actions">
                    <button onClick={exportExcel}>📥 Export</button>
                    <button onClick={fetchCertificates}>🔄 Refresh</button>
                    <button onClick={resetForm}>🧹 Clear</button>
                </div>

                <form className="admin-form" onSubmit={handleSubmit}>
                    <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
                    <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
                    <input name="course" placeholder="Course" value={form.course} onChange={handleChange} required />

                    <input
                        name="certificateId"
                        placeholder="Certificate ID"
                        value={form.certificateId}
                        onChange={handleChange}
                        disabled={isEditing}
                        required
                    />

                    <input
                        type="date"
                        name="completionDate"
                        value={form.completionDate}
                        onChange={handleChange}
                        required
                    />

                    {!isEditing ? (
                        <button type="submit">➕ Add</button>
                    ) : (
                        <>
                            <button type="button" onClick={handleUpdate}>✏️ Update</button>
                            <button type="button" onClick={resetForm}>Cancel</button>
                        </>
                    )}
                </form>

                <input
                    className="search-input"
                    placeholder="Search by Name or ID"
                    onChange={(e) => setSearch(e.target.value)}
                />

                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Course</th>
                            <th>ID</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filtered.map((cert) => (
                            <tr key={cert.certificateId}>
                                <td>{cert.name}</td>
                                <td>{cert.email}</td>
                                <td>{cert.course}</td>
                                <td>{cert.certificateId}</td>
                                <td>
                                    {cert.completionDate
                                        ? new Date(cert.completionDate).toLocaleDateString()
                                        : cert.issueDate
                                            ? new Date(cert.issueDate).toLocaleDateString()
                                            : "N/A"}
                                </td>
                                <td>
                                    <button onClick={() => handleDeleteClick(cert.certificateId)}>❌</button>
                                    <button onClick={() => handleEdit(cert)}>✏️</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* DELETE MODAL */}
                {showConfirm && (
                    <div className="modal-overlay">
                        <div className="modal-box">
                            <h3>⚠️ Confirm Delete</h3>
                            <p>Are you sure you want to delete?</p>

                            <button onClick={confirmDelete}>Yes</button>
                            <button onClick={cancelDelete}>No</button>
                        </div>
                    </div>
                )}

            </div>
        </>
    );
}