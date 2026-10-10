import { Navigate } from 'react-router-dom';

function ProtectedRoute({ role, children }) {
  const token = localStorage.getItem('recruito_token');
  const user = JSON.parse(localStorage.getItem('recruito_user') || 'null');

  if (!token || !user) return <Navigate to="/" replace />;
    if (user.role !== role) {
    return <Navigate to={user.role === 'EMPLOYER' ? '/employer/dashboard' : '/'} replace />;
    }
  return children;
}

export default ProtectedRoute;