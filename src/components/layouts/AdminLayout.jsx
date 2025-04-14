
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { adminMenuItems } from "../../data/menuItems";
import { toast } from "sonner";
import BaseLayout from "./BaseLayout";

const AdminLayout = () => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  
  // Check role on component mount, but only if user is loaded
  useEffect(() => {
    if (user && user.role !== "admin") {
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

  return <BaseLayout menuItems={adminMenuItems} role="Admin" />;
};

export default AdminLayout;
