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

            let data = [];

            if (res.ok) {
                const result = await res.json();

                console.log("API DATA:", result);

                if (Array.isArray(result)) {
                    data = result;
                } else if (result.users && Array.isArray(result.users)) {
                    data = result.users; 
                }
            }

            setUsers(data);

        } catch (err) {
            console.error("Fetch Error:", err);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const filtered = users.filter(user => {
        const name = user?.name || "";
        const email = user?.email || "";

        return (
            name.toLowerCase().includes(search.toLowerCase()) ||
            email.toLowerCase().includes(search.toLowerCase())
        );
    });

    return (
        <div className="admin-container">

            <h2>👥 Registered Users</h2>

            <input
                className="search-input"
                placeholder="Search by name or email"
                value={search}
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
                                <tr key={user._id || index}>
                                    <td>{index + 1}</td>
                                    <td>{user.name || "N/A"}</td>
                                    <td>{user.email || "N/A"}</td>
                                    <td>{user.role || "N/A"}</td>
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