
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { userMenuItems } from "../../data/menuItems";
import { toast } from "sonner";
import BaseLayout from "./BaseLayout";

const UserLayout = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useSelector(state => state.auth);
  
  // Check role on component mount
  useEffect(() => {
    if (user && user.role !== "user") {
      // Only show toast once
      const hasShownToast = sessionStorage.getItem('role_redirect_toast');
      if (!hasShownToast) {
        toast.error("Unauthorized access. Redirecting to appropriate dashboard.");
        sessionStorage.setItem('role_redirect_toast', 'true');
      }
      navigate(`/${user.role.toLowerCase()}/dashboard`);
    }
    
    // Clear the toast flag when component unmounts
    return () => {
      sessionStorage.removeItem('role_redirect_toast');
    };
  }, [user, navigate]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  return <BaseLayout menuItems={userMenuItems} role="User" />;
};

export default UserLayout;
