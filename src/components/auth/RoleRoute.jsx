
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

const RoleRoute = ({ children, allowedRoles }) => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  // If no user or not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // If user doesn't have the required role, redirect to their dashboard
  if (!allowedRoles.includes(user.role)) {
    const redirectPath = `/${user.role.toLowerCase()}/dashboard`;
    // Only show toast if we're not already on the user's dashboard path to avoid toast spam
    if (!location.pathname.startsWith(`/${user.role.toLowerCase()}`)) {
      toast.error(`Access denied. Redirecting to ${user.role} dashboard.`);
    }
    return <Navigate to={redirectPath} replace state={{ from: location.pathname }} />;
  }

  return children;
};

export default RoleRoute;
