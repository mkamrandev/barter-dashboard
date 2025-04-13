
import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import Header from "../common/Header";
import { adminMenuItems } from "../../data/menuItems";
import { toast } from "sonner";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Check if user is authenticated as admin (would be enhanced with actual auth)
  const checkAuth = () => {
    const userRole = localStorage.getItem("userRole");
    if (!userRole || userRole !== "admin") {
      toast.error("Unauthorized access. Please login first.");
      navigate("/login");
      return false;
    }
    return true;
  };

  // Effect to verify auth on component mount
  React.useEffect(() => {
    checkAuth();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        menuItems={adminMenuItems} 
        isOpen={sidebarOpen} 
        role="Admin"
      />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header 
          toggleSidebar={toggleSidebar}
          sidebarOpen={sidebarOpen}
          userRole="Admin"
        />
        
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
