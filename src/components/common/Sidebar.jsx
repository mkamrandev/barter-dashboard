
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Sidebar = ({ menuItems, isOpen, role }) => {
  const location = useLocation();

  return (
    <div
      className={cn(
        "bg-white border-r border-gray-200 transition-all duration-300 ease-in-out h-screen flex flex-col",
        isOpen ? "w-64" : "w-16"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        {isOpen ? (
          <h1 className="text-xl font-bold text-blue-600">Barter Exchange</h1>
        ) : (
          <span className="text-lg font-bold text-blue-600">BE</span>
        )}
      </div>

      <div className={cn("py-2 px-3", isOpen ? "text-sm" : "text-xs text-center")}>
        <span className="text-gray-500">{isOpen ? `${role} Panel` : role}</span>
      </div>

      <nav className="flex-1 overflow-auto py-2">
        <ul className="space-y-1 px-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              {item.type === "group" ? (
                <div className="space-y-1">
                  {isOpen && (
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {item.title}
                    </div>
                  )}
                  <ul className="space-y-1">
                    {item.children.map((child, childIndex) => (
                      <li key={childIndex}>
                        <Link
                          to={child.path}
                          className={cn(
                            "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                            location.pathname === child.path
                              ? "bg-blue-50 text-blue-700"
                              : "text-gray-700 hover:bg-gray-100",
                            !isOpen && "justify-center"
                          )}
                        >
                          <child.icon className={cn("h-5 w-5", isOpen && "mr-2")} />
                          {isOpen && <span>{child.title}</span>}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    location.pathname === item.path
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100",
                    !isOpen && "justify-center"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", isOpen && "mr-2")} />
                  {isOpen && <span>{item.title}</span>}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-center">
          <Link
            to="/help"
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            {isOpen ? "Help & Support" : "Help"}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
