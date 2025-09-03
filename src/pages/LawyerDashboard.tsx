import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LawyerHome from './lawyer/LawyerHome';
import LawyerCases from './lawyer/LawyerCases';
import LawyerAvailableCases from './lawyer/LawyerAvailableCases';
import LawyerMessages from './lawyer/LawyerMessages';
import LawyerCaseDetail from './lawyer/LawyerCaseDetail';

const LawyerDashboard: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LawyerHome />} />
      <Route path="/casos" element={<LawyerCases />} />
      <Route path="/casos/:caseId" element={<LawyerCaseDetail />} />
      <Route path="/disponibles" element={<LawyerAvailableCases />} />
      <Route path="/mensajes" element={<LawyerMessages />} />
      <Route path="*" element={<Navigate to="/abogado" replace />} />
    </Routes>
  );
};

export default LawyerDashboard;

