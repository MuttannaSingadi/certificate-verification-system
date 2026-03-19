import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UploadStudents from "./pages/UploadStudents";
import SearchCertificate from "./pages/SearchCertificate";
function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/uploadstudents" element={<UploadStudents />} />
        <Route path="/search-certificate" element={<SearchCertificate />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;