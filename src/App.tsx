import { Routes, Route, Navigate } from "react-router-dom";
import HomeClient from "./pages/HomeClient";
import LawyerDashboard from "./pages/LawyerDashboard";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeClient />} />
      <Route path="/abogados" element={<LawyerDashboard />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}