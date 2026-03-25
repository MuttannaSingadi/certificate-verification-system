import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UploadStudents from "./pages/UploadStudents";
import SearchCertificate from "./pages/SearchCertificate";
import CertificateDetails from "./pages/CertificateDetails";
import GenerateCertificate from "./pages/GenerateCertificate";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ✅ PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/searchcertificate" element={<SearchCertificate />} />
        <Route path="/certificate" element={<CertificateDetails />} />

        {/* 🔒 PROTECTED ROUTES */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/uploadstudents"
          element={
            <ProtectedRoute>
              <UploadStudents />
            </ProtectedRoute>
          }
        />

        <Route
          path="/generatecertificate"
          element={
            <ProtectedRoute>
              <GenerateCertificate />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admindashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;