
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import Header from "../common/Header";

const BaseLayout = ({ menuItems, role, checkRoleAccess }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Function to toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        menuItems={menuItems} 
        isOpen={sidebarOpen} 
        role={role}
      />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header 
          toggleSidebar={toggleSidebar}
          sidebarOpen={sidebarOpen}
          userRole={role}
        />
        
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default BaseLayout;
