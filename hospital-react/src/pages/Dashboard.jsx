import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  if (user?.role === 'ADMIN') return <Navigate to="/admin-dashboard" replace />;
  if (user?.role === 'DOCTOR') return <Navigate to="/doctor-dashboard" replace />;
  return <Navigate to="/patient-dashboard" replace />;
}
