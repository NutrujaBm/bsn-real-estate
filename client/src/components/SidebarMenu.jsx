import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Dashboard from "../pages/AdminDashboard";
import UserManagement from "../pages/UserManagement";
import PropertyManagement from "../pages/PropertyManagement";
import AdminReportPage from "../pages/AdminReportPage";
import { useSelector } from "react-redux";
import AdminReportList from "../pages/AdminReportList";

const SidebarMenu = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  // Function to extract the current page title from the URL
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/admin/dashboard":
        return "ภาพรวมของระบบ";
      case "/admin/users":
        return "ผู้ใช้งานภายในระบบ";
      case "/admin/properties":
        return "จัดการอสังหาริมทรัพย์";
      case "/admin/report":
        return "รายงานปัญหา";
      case "/admin/notification-history":
        return "ดูประวัติการแจ้งเตือน";
      default:
        return "Admin Panel";
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-75 bg-white text-black flex flex-col shadow-2xl border border-gray-200">
        <h1 className="font-bold text-lg lg:text-2xl flex items-center space-x-2 lg:justify-start justify-center py-1 pl-8 border-b shadow-sm">
          <img
            src="/logo.png"
            alt="BSN Real Estate Logo"
            className="h-20 sm:h-20"
          />
          <div className="flex flex-col text-left mt-0">
            <span className="hidden lg:inline text-primary-600 text-md sm:text-xl leading-relaxed tracking-wide text-yellow-500 belanosima-regular">
              BSN
            </span>
            <span className="hidden lg:inline text-sm sm:text-sm leading-relaxed tracking-wide text-indigo-500 belanosima-regular">
              REAL ESTATE
            </span>
          </div>
        </h1>
        <ul className="flex-grow p-3 ">
          <li>
            <a
              href="/admin/dashboard"
              className="p-4 block hover:bg-gray-200 text-base"
            >
              ภาพรวมของระบบ
            </a>
          </li>
          <li>
            <a
              href="/admin/users"
              className="p-4 block hover:bg-gray-200 text-base"
            >
              ผู้ใช้งานภายในระบบ
            </a>
          </li>
          <li>
            <a
              href="/admin/properties"
              className="p-4 block hover:bg-gray-200 text-base"
            >
              จัดการอสังหาริมทรัพย์
            </a>
          </li>
          <li>
            <a
              href="/admin/report"
              className="p-4 block hover:bg-gray-200 text-base"
            >
              รายงานปัญหา
            </a>
          </li>
          <li>
            <a
              href="/admin/notification-history"
              className="p-4 block hover:bg-gray-200 text-base"
            >
              ดูประวัติการแจ้งเตือน
            </a>
          </li>
          {/* Profile submenu */}
          <li>
            <button
              className="p-4 w-full text-left hover:bg-gray-700 text-base"
              onClick={toggleProfileMenu}
            >
              Profile
            </button>
            {isProfileMenuOpen && (
              <ul className="pl-6 bg-gray-700">
                {/* <li>
            <a
              href="/admin/profile"
              className="p-4 block hover:bg-gray-600"
            >
              Profile Info
            </a>
          </li>
          <li>
            <a
              href="/admin/settings"
              className="p-4 block hover:bg-gray-600"
            >
              Settings
            </a>
          </li> */}
              </ul>
            )}
          </li>
        </ul>
      </div>

      {/* Content Area */}
      <div className="flex-grow p-8 bg-neutral-100">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 bg-slate-400">
          {/* Page Title */}
          <div className="text-3xl font-bold">
            {getPageTitle()} {/* Dynamically display page title */}
          </div>

          {/* Header Right Section */}
          <div className="flex items-center space-x-6 ">
            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search..."
              className="p-2 bg-gray-200 rounded-lg"
            />

            {/* Profile and Username */}
            <div className="flex items-center space-x-3">
              <span className="text-xl">
                Hello,
                {currentUser.username}
              </span>{" "}
              {/* Username */}
              <button
                className="p-2 bg-gray-700 rounded-full"
                onClick={toggleProfileMenu}
              >
                <img
                  src={currentUser.avatar}
                  alt="avatar"
                  className="w-10 h-10 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500"
                />
              </button>
            </div>
          </div>
        </div>

        {/* Routes */}
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="properties" element={<PropertyManagement />} />
          <Route path="report" element={<AdminReportPage />} />
          {/* Add profile routes */}
          {/* <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} /> */}
        </Routes>
      </div>
    </div>
  );
};

export default SidebarMenu;
