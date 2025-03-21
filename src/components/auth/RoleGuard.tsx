import React from 'react';
import { useAuth, UserRole } from '../../lib/auth';
import Link from 'next/link';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallback?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRoles,
  fallback
}) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!user || !allowedRoles.includes(user.role)) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return (
      <div className="p-8 bg-red-50 rounded-lg border border-red-200">
        <h3 className="text-lg font-medium text-red-800 mb-2">Доступ запрещен</h3>
        <p className="text-red-600 mb-4">У вас нет прав для доступа к этому разделу.</p>
        <Link 
          href="/dashboard" 
          className="text-sm text-blue-600 hover:underline"
        >
          Вернуться на главную
        </Link>
      </div>
    );
  }
  
  return <>{children}</>;
};
