import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UploadStudents from "./pages/UploadStudents";
import SearchCertificate from "./pages/SearchCertificate";
import CertificateDetails from "./pages/CertificateDetails";
import GenerateCertificate from "./pages/GenerateCertificate";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* USER */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/searchcertificate"
          element={
            <ProtectedRoute>
              <SearchCertificate />
            </ProtectedRoute>
          }
        />

        <Route
          path="/certificate"
          element={
            <ProtectedRoute>
              <CertificateDetails />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admindashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/uploadstudents"
          element={
            <ProtectedRoute role="admin">
              <UploadStudents />
            </ProtectedRoute>
          }
        />

        <Route
          path="/generatecertificate"
          element={
            <ProtectedRoute role="admin">
              <GenerateCertificate />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;