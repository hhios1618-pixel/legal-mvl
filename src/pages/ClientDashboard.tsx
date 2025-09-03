import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ClientHome from './client/ClientHome';
import ClientCases from './client/ClientCases';
import ClientNewCase from './client/ClientNewCase';
import ClientMessages from './client/ClientMessages';
import ClientCaseDetail from './client/ClientCaseDetail';

const ClientDashboard: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<ClientHome />} />
      <Route path="/casos" element={<ClientCases />} />
      <Route path="/casos/:caseId" element={<ClientCaseDetail />} />
      <Route path="/nuevo-caso" element={<ClientNewCase />} />
      <Route path="/mensajes" element={<ClientMessages />} />
      <Route path="*" element={<Navigate to="/cliente" replace />} />
    </Routes>
  );
};

export default ClientDashboard;

