
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

const RoleRoute = ({ children, allowedRoles }) => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  // If user doesn't have the required role, redirect to their dashboard
  if (user && !allowedRoles.includes(user.role)) {
    const redirectPath = `/${user.role.toLowerCase()}/dashboard`;
    toast.error(`Access denied. Redirecting to ${user.role} dashboard.`);
    return <Navigate to={redirectPath} replace state={{ from: location.pathname }} />;
  }

  return children;
};

export default RoleRoute;
