import { useEffect, useState } from "react";
import "../styles/admin.css";

export default function RegisteredUsers() {

    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const API = "https://certificate-verification-system-tpcf.onrender.com/api/users";

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch(API);

            // ❌ handle 404 or error
            if (!res.ok) {
                throw new Error("API not found");
            }

            const data = await res.json();
            console.log("API DATA:", data);

            // ✅ FIX: ensure array
            if (Array.isArray(data)) {
                setUsers(data);
            } else {
                setUsers([]);
            }

        } catch (err) {
            console.error("Fetch Error:", err);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    // ✅ SAFE FILTER
    const filtered = Array.isArray(users)
        ? users.filter(user =>
            user.name?.toLowerCase().includes(search.toLowerCase()) ||
            user.email?.toLowerCase().includes(search.toLowerCase())
        )
        : [];

    return (
        <div className="admin-container">

            <h2>👥 Registered Users</h2>

            <input
                className="search-input"
                placeholder="Search by name or email"
                onChange={(e) => setSearch(e.target.value)}
            />

            {loading ? (
                <p>Loading users...</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filtered.length > 0 ? (
                            filtered.map((user, index) => (
                                <tr key={user._id}>
                                    <td>{index + 1}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">No users found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}

        </div>
    );
}