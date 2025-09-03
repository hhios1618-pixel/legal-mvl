
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './store';
import LoginForm from './components/LoginForm';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import ToastContainer from './components/ToastContainer';
import HomeClient from './pages/HomeClient';

// Pages
import ClientDashboard from './pages/ClientDashboard';
import LawyerDashboard from './pages/LawyerDashboard';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  const { isAuthenticated, currentUser } = useApp();

  return (
    <>
      <Routes>
        <Route path="/" element={<HomeClient />} />
        <Route path="/login" element={<LoginForm onSuccess={() => {}} />} />

        {/* Rutas de cliente */}
        <Route
          path="/cliente/*"
          element={
            <ProtectedRoute allowedRoles={['cliente']}>
              <Layout>
                <ClientDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        {/* Rutas de abogado */}
        <Route
          path="/abogado/*"
          element={
            <ProtectedRoute allowedRoles={['abogado']}>
              <Layout>
                <LawyerDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        {/* Rutas de admin */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
              <Layout>
                <AdminDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer />
    </>
  );
}


