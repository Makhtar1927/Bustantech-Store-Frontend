import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    // Si non authentifié, on redirige vers la page de connexion.
    return <Navigate to="/login" replace />;
  }

  // Si le token existe, on affiche la page protégée (ici, la page Admin).
  return <Outlet />;
};

export default ProtectedRoute;