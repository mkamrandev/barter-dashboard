
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { loadUserFromToken } from '../../redux/slices/authSlice';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useSelector((state) => state.auth);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const checkAuthentication = async () => {
      // If we have a token but no user data, try to load it
      if (localStorage.getItem('access_token') && !user) {
        await dispatch(loadUserFromToken()).unwrap()
          .catch(() => {}) // Catch and ignore error, handled by rejected case
      }
      setIsCheckingAuth(false);
    };

    checkAuthentication();
  }, [dispatch, user]);

  // If authentication is being checked, show a loading state
  if (isLoading || isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-3 text-gray-700">Loading your dashboard...</p>
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
