import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "../styles/admin.css";
import * as XLSX from "xlsx";

export default function AdminDashboard() {

    const [form, setForm] = useState({
        name: "",
        email: "",
        course: "",
        certificateId: ""
    });

    const [certificates, setCertificates] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [originalId, setOriginalId] = useState(null);
    const [search, setSearch] = useState("");

    const API = "https://certificate-verification-system-tpcf.onrender.com/api/certificates";

    const fetchCertificates = async () => {
        try {
            const res = await fetch(API);
            const data = await res.json();
            setCertificates(data);
        } catch {
            console.error("Error fetching data");
        }
    };

    useEffect(() => {
        fetchCertificates();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        });

        const data = await res.json();
        alert(data.message);

        fetchCertificates();
        resetForm();
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this certificate?")) return;

        await fetch(`${API}/${id}`, { method: "DELETE" });
        alert("Deleted successfully");
        fetchCertificates();
    };

    const handleEdit = (cert) => {
        setForm(cert);
        setOriginalId(cert.certificateId);
        setIsEditing(true);
    };

    const handleUpdate = async () => {
        await fetch(`${API}/${originalId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        });

        alert("Updated successfully");
        fetchCertificates();
        resetForm();
    };

    const resetForm = () => {
        setForm({ name: "", email: "", course: "", certificateId: "" });
        setOriginalId(null);
        setIsEditing(false);
    };

    // 🔥 Export Excel
    const exportExcel = () => {
        const ws = XLSX.utils.json_to_sheet(certificates);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Certificates");
        XLSX.writeFile(wb, "certificates.xlsx");
    };

    // 🔍 Filter
    const filtered = certificates.filter(cert =>
        cert.name.toLowerCase().includes(search.toLowerCase()) ||
        cert.certificateId.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <Navbar />

            <div className="admin-container">

                <h2>🛠 Admin Dashboard</h2>

                {/* 📊 Stats */}
                <div className="stats">
                    <div className="card">📄 Total: {certificates.length}</div>
                    <div className="card">📚 Courses: {new Set(certificates.map(c => c.course)).size}</div>
                </div>

                {/* FORM */}
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

                    {!isEditing ? (
                        <button type="submit">➕ Add</button>
                    ) : (
                        <>
                            <button type="button" onClick={handleUpdate}>✏️ Update</button>
                            <button type="button" onClick={resetForm}>Cancel</button>
                        </>
                    )}
                </form>

                {/* 🔍 Search + Export */}
                <div className="actions-bar">
                    <input
                        className="search-input"
                        placeholder="Search by Name or ID"
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <button className="export-btn" onClick={exportExcel}>
                        📥 Export Excel
                    </button>
                </div>

                {/* TABLE */}
                <div className="table-container">

                    <h3>📄 All Certificates</h3>

                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Course</th>
                                <th>ID</th>
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
                                        <button onClick={() => handleDelete(cert.certificateId)}>❌</button>
                                        <button onClick={() => handleEdit(cert)}>✏️</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>

                </div>

            </div>
        </>
    );
}