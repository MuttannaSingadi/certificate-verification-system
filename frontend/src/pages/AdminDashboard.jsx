import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/admin.css";
import * as XLSX from "xlsx";

export default function AdminDashboard() {

    const navigate = useNavigate();

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

    const [selectedFile, setSelectedFile] = useState(null);

    const API = "https://certificate-verification-system-tpcf.onrender.com/api/certificates";

    useEffect(() => {
        fetchCertificates();
    }, []);

    const fetchCertificates = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch(API, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await res.json();

            console.log("API DATA:", data);

            setCertificates(Array.isArray(data) ? data : []);

        } catch (err) {
            console.error("Error fetching data:", err);
            setCertificates([]);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");

            await fetch(API, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(form)
            });

            setMessage(" Certificate added successfully");
            fetchCertificates();
            resetForm();
        } catch {
            setMessage("❌ Error adding certificate");
        }

        setTimeout(() => setMessage(""), 2000);
    };

    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setShowConfirm(true);
    };

    const confirmDelete = async () => {
        try {
            const token = localStorage.getItem("token");

            await fetch(`${API}/${deleteId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            setMessage("❌ Certificate deleted successfully");
            fetchCertificates();
        } catch {
            setMessage("❌ Error deleting certificate");
        }

        setShowConfirm(false);
        setDeleteId(null);
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
        try {
            const token = localStorage.getItem("token");

            await fetch(`${API}/${originalId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(form)
            });

            setMessage("✏️ Certificate updated successfully");
            fetchCertificates();
            resetForm();
        } catch {
            setMessage("❌ Error updating certificate");
        }

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
        const formattedData = certificates.map(cert => ({
            Name: cert.name,
            Email: cert.email,
            Course: cert.course,
            "Certificate ID": cert.certificateId,
            "Completion Date": cert.completionDate
                ? new Date(cert.completionDate).toLocaleDateString()
                : "N/A"
        }));

        const ws = XLSX.utils.json_to_sheet(formattedData);

        ws["!cols"] = [
            { wch: 20 },
            { wch: 25 },
            { wch: 20 },
            { wch: 20 },
            { wch: 18 }
        ];

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Certificates");

        XLSX.writeFile(wb, `Certificates_${new Date().toISOString().slice(0, 10)}.xlsx`);
    };

    const handleFileUpload = async () => {

        if (!selectedFile) {
            setMessage("⚠️ Please select a file first");
            return;
        }

        const reader = new FileReader();

        reader.onload = async (evt) => {
            const data = new Uint8Array(evt.target.result);
            const workbook = XLSX.read(data, { type: "array" });

            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            const jsonData = XLSX.utils.sheet_to_json(sheet);

            try {
                const token = localStorage.getItem("token");

                for (let row of jsonData) {
                    const formatted = {
                        name: row.Name || "",
                        email: row.Email || "",
                        course: row.Course || "",
                        certificateId: row["Certificate ID"] || "",
                        completionDate: row["Completion Date"] || ""
                    };

                    await fetch(API, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify(formatted)
                    });
                }

                setMessage("✅ Excel uploaded successfully");
                fetchCertificates();

            } catch (err) {
                console.error(err);
                setMessage("❌ Upload failed");
            }

            setTimeout(() => setMessage(""), 3000);
        };

        reader.readAsArrayBuffer(selectedFile);
    };

    const filtered = Array.isArray(certificates)
        ? certificates.filter(cert =>
            (cert.name || "").toLowerCase().includes(search.toLowerCase()) ||
            (cert.certificateId || "").toLowerCase().includes(search.toLowerCase())
        )
        : [];

    const handleLogout = () => {
        localStorage.clear();
        navigate("/", { replace: true });
    };

    const [menuOpen, setMenuOpen] = useState(false);

    const AdminNavbar = () => (
        <div className="admin-navbar">

            <div className="logo">🎓 Admin Panel</div>

            <div className="admin-menu-icon" onClick={() => setMenuOpen(prev => !prev)}>
                ☰
            </div>

            <div className={`nav-links ${menuOpen ? "active" : ""}`}>
                <button onClick={() => {
                    navigate("/");
                    setMenuOpen(false);
                }}>
                    Home
                </button>

                <button onClick={() => navigate("/users")}>
                    👥 Users
                </button>

                <button onClick={() => {
                    exportExcel();
                    setMenuOpen(false);
                }}>Export</button>

                <button onClick={() => {
                    resetForm();
                    setMenuOpen(false);
                }}>Clear</button>

                <button className="logout" onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                }}>
                    Logout
                </button>
            </div>

        </div>
    );

    return (
        <>
            <AdminNavbar />

            <div className="admin-container">

                {message && <div className="success-msg">{message}</div>}

                <h2>🛠 Admin Dashboard</h2>

                <div className="admin-actions">
                    <div className="upload-section">
                        <input
                            type="file"
                            accept=".xlsx, .xls"
                            onChange={(e) => setSelectedFile(e.target.files[0])}
                        />
                        <button onClick={handleFileUpload}>
                            📤 Upload Excel
                        </button>
                    </div>
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

                {showConfirm && (
                    <div className="modal-overlay">
                        <div className="modal-box">
                            <h3>⚠️ Confirm Delete</h3>
                            <button onClick={confirmDelete}>Yes</button>
                            <button onClick={cancelDelete}>No</button>
                        </div>
                    </div>
                )}

            </div>
        </>
    );
}