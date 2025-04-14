
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { subadminMenuItems } from "../../data/menuItems";
import { toast } from "sonner";
import BaseLayout from "./BaseLayout";

const SubAdminLayout = () => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  
  // Check role on component mount
  useEffect(() => {
    if (user && user.role !== "subadmin") {
      toast.error("Unauthorized access. Redirecting to appropriate dashboard.");
      navigate(`/${user.role.toLowerCase()}/dashboard`);
    }
  }, [user, navigate]);

  return <BaseLayout menuItems={subadminMenuItems} role="Subadmin" />;
};

export default SubAdminLayout;
