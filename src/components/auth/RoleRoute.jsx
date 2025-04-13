
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const RoleRoute = ({ children, allowedRoles }) => {
  const { user } = useSelector((state) => state.auth);

  // If user doesn't have the required role, redirect to their dashboard
  if (user && !allowedRoles.includes(user.role)) {
    const redirectPath = `/${user.role.toLowerCase()}/dashboard`;
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default RoleRoute;
