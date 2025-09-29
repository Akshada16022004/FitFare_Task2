import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  BarChartIcon,
  ClipboardListIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { name: 'Manage Gyms', icon: ClipboardListIcon },
    { name: 'View Analysis', icon: BarChartIcon },
    { name: 'Order Summary', icon: ClipboardListIcon },
    { name: 'Feedback & Ratings', icon: ClipboardListIcon },
    { name: 'Notifications', icon: BellIcon },
    { name: 'Logout', icon: ArrowRightOnRectangleIcon, action: logout },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-blue-800 text-white w-64 flex flex-col transition-all duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-64'
        }`}
      >
        <div className="flex items-center justify-center h-16 shadow-md bg-blue-900">
          <h1 className="text-xl font-bold">{user?.gymName || 'Gym Dashboard'}</h1>
        </div>

        <nav className="flex-1 mt-6 px-2 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={item.action || (() => {})}
              className="flex items-center space-x-3 w-full px-3 py-2 rounded hover:bg-blue-700 transition"
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-md h-16 flex items-center justify-between px-6">
          <button
            className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-200"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <div className="text-gray-700 font-medium">Welcome, {user?.name}</div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;




