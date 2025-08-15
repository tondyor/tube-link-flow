import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSession } from '@/context/SessionContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = () => {
  const { session, loading } = useSession();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;