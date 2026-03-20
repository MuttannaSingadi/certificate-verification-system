import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "../styles/admin.css";

export default function AdminDashboard() {

    const [form, setForm] = useState({
        name: "",
        email: "",
        course: "",
        certificateId: ""
    });

    const [certificates, setCertificates] = useState([]);
    const [isEditing, setIsEditing] = useState(false);

    const API = "https://certificate-verification-system-tpcf.onrender.com/api/certificates";

    // Fetch all certificates
    const fetchCertificates = async () => {
        try {
            const res = await fetch(API);
            const data = await res.json();
            setCertificates(data);
        } catch (err) {
            console.error("Error fetching data");
        }
    };

    useEffect(() => {
        fetchCertificates();
    }, []);

    // Handle input
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // ADD
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(API, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            const data = await res.json();
            alert(data.message);

            fetchCertificates();
            resetForm();

        } catch {
            alert("Error adding certificate");
        }
    };

    // DELETE
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this certificate?")) return;

        try {
            await fetch(`${API}/${id}`, { method: "DELETE" });
            alert("Deleted successfully");
            fetchCertificates();
        } catch {
            alert("Delete failed");
        }
    };

    // EDIT
    const handleEdit = (cert) => {
        setForm(cert);
        setIsEditing(true);
    };

    // UPDATE
    const handleUpdate = async () => {
        try {
            await fetch(`${API}/${form.certificateId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            alert("Updated successfully");

            fetchCertificates();
            resetForm();

        } catch {
            alert("Update failed");
        }
    };

    // RESET FORM
    const resetForm = () => {
        setForm({
            name: "",
            email: "",
            course: "",
            certificateId: ""
        });
        setIsEditing(false);
    };

    return (
        <>
            <Navbar />

            <div className="admin-container">

                <h2>🛠 Admin Dashboard</h2>

                {/* FORM */}
                <form className="admin-form" onSubmit={handleSubmit}>

                    <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
                    <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
                    <input name="course" placeholder="Course" value={form.course} onChange={handleChange} required />
                    <input name="certificateId" placeholder="Certificate ID" value={form.certificateId} onChange={handleChange} required />

                    {!isEditing ? (
                        <button type="submit">➕ Add</button>
                    ) : (
                        <>
                            <button type="button" onClick={handleUpdate}>✏️ Update</button>
                            <button type="button" onClick={resetForm}>Cancel</button>
                        </>
                    )}

                </form>

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
                            {certificates.map((cert) => (
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