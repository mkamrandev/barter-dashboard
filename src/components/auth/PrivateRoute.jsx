
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { loadUserFromToken } from '../../redux/slices/authSlice';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    // If we have a token but no user data, try to load it
    if (!isLoading && localStorage.getItem('token') && !user) {
      dispatch(loadUserFromToken());
    }
  }, [dispatch, isLoading, user]);

  // If authentication is being checked, show a loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login with the return path
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If authenticated, render the children
  return children;
};

export default PrivateRoute;
