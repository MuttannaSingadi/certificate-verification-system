import { useEffect, useState } from "react";
import "../styles/admin.css";

export default function RegisteredUsers() {

    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");

    const API = "https://certificate-verification-system-tpcf.onrender.com/api/users";

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch(API);
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            console.error(err);
        }
    };

    const filtered = users.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="admin-container">

            <h2>👥 Registered Users</h2>

            <input
                className="search-input"
                placeholder="Search by name or email"
                onChange={(e) => setSearch(e.target.value)}
            />

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
                    {filtered.map((user, index) => (
                        <tr key={user._id}>
                            <td>{index + 1}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
}