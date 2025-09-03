import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminHome from './admin/AdminHome';
import AdminCases from './admin/AdminCases';
import AdminLawyers from './admin/AdminLawyers';
import AdminMetrics from './admin/AdminMetrics';
import AdminAudit from './admin/AdminAudit';

const AdminDashboard: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminHome />} />
      <Route path="/casos" element={<AdminCases />} />
      <Route path="/abogados" element={<AdminLawyers />} />
      <Route path="/metricas" element={<AdminMetrics />} />
      <Route path="/auditoria" element={<AdminAudit />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default AdminDashboard;

