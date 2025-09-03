import React from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../store';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = [], 
  requireAuth = true 
}) => {
  const { isAuthenticated, currentUser } = useApp();

  // Si requiere autenticación y no está autenticado
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado pero no tiene el rol permitido
  if (isAuthenticated && currentUser && allowedRoles.length > 0) {
    if (!allowedRoles.includes(currentUser.role)) {
      // Redirigir según el rol del usuario
      switch (currentUser.role) {
        case 'cliente':
          return <Navigate to="/cliente" replace />;
        case 'abogado':
          return <Navigate to="/abogado" replace />;
        case 'admin':
          return <Navigate to="/admin" replace />;
        default:
          return <Navigate to="/login" replace />;
      }
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;

