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

    // Fetch all certificates
    const fetchCertificates = async () => {
        const res = await fetch("https://certificate-verification-system-tpcf.onrender.com/api/certificates");
        const data = await res.json();
        setCertificates(data);
    };

    useEffect(() => {
        fetchCertificates();
    }, []);

    // Handle form input
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Add certificate
    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch("https://certificate-verification-system-tpcf.onrender.com/api/certificates", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(form)
        });

        const data = await res.json();
        alert(data.message);

        fetchCertificates(); // refresh list

        setForm({
            name: "",
            email: "",
            course: "",
            certificateId: ""
        });
    };

    // DELETE
    const handleDelete = async (id) => {
        await fetch(`https://certificate-verification-system-tpcf.onrender.com/api/certificates/${id}`, {
            method: "DELETE"
        });

        fetchCertificates();
    };

    // EDIT (fill form)
    const handleEdit = (cert) => {
        setForm(cert);
    };

    // UPDATE
    const handleUpdate = async () => {
        await fetch(`https://certificate-verification-system-tpcf.onrender.com/api/certificates/${form.certificateId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        });

        fetchCertificates();
    };

    return (
        <>
            <Navbar />

            <div className="admin-container">

                <h2>🛠 Admin Dashboard</h2>

                {/* Form */}
                <form className="admin-form" onSubmit={handleSubmit}>

                    <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
                    <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
                    <input name="course" placeholder="Course" value={form.course} onChange={handleChange} />
                    <input name="certificateId" placeholder="Certificate ID" value={form.certificateId} onChange={handleChange} />

                    <button type="submit">➕ Add</button>
                    <button type="button" onClick={handleUpdate}>✏️ Update</button>

                </form>

                {/* Table */}
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
                            {certificates.map((cert, index) => (
                                <tr key={index}>
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