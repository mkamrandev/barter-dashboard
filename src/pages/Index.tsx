
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center max-w-2xl px-4">
        <h1 className="text-4xl font-bold mb-6 text-blue-700">Barter Exchange Dashboard</h1>
        <p className="text-xl text-gray-600 mb-8">
          A comprehensive platform for bartering goods with role-based access control
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Link to="/login">Login to Your Account</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/signup">Create New Account</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3 text-blue-600">Admin Panel</h2>
            <p className="text-gray-600 mb-4">
              Manage users, subadmins, and system settings with full administrative control.
            </p>
            <div className="text-sm text-gray-500">
              Demo: admin@demo.com / password
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3 text-purple-600">Subadmin Portal</h2>
            <p className="text-gray-600 mb-4">
              Monitor users and categories with limited administrative privileges.
            </p>
            <div className="text-sm text-gray-500">
              Demo: subadmin@demo.com / password
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3 text-green-600">User Dashboard</h2>
            <p className="text-gray-600 mb-4">
              List items for barter, manage your profile, and browse available exchanges.
            </p>
            <div className="text-sm text-gray-500">
              Demo: user@demo.com / password
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
