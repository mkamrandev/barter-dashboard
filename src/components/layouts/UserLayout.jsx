
import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "../common/Sidebar";
import Header from "../common/Header";
import { userMenuItems } from "../../data/menuItems";
import { toast } from "sonner";

const UserLayout = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useSelector(state => state.auth);
  
  // Check role on component mount
  React.useEffect(() => {
    if (user && user.role !== "user") {
      toast.error("Unauthorized access. Redirecting to appropriate dashboard.");
      navigate(`/${user.role.toLowerCase()}/dashboard`);
    }
  }, [user, navigate]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        menuItems={userMenuItems} 
        isOpen={sidebarOpen} 
        role="User"
      />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header 
          toggleSidebar={toggleSidebar}
          sidebarOpen={sidebarOpen}
          userRole="User"
        />
        
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
