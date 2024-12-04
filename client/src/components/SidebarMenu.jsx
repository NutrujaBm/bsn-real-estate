import React, { useState } from "react";
import { Routes, Route, useLocation, Link } from "react-router-dom";
import Dashboard from "../pages/AdminDashboard";
import UserManagement from "../pages/UserManagement";
import PropertyManagement from "../pages/PropertyManagement";
import AdminReportPage from "../pages/AdminReportPage";

function SidebarMenu() {
  return (
    <div className="flex h-[88.9vh]">
      {/* Sidebar */}
      <div className="w-75 bg-white text-black flex flex-col shadow-2xl border border-gray-200 ">
        <ul className="flex-grow p-3">
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
          {/* <li>
            <a
              href="/admin/notification-history"
              className="p-4 block hover:bg-gray-200 text-base"
            >
              ดูประวัติการแจ้งเตือน
            </a>
          </li> */}
        </ul>
      </div>

      {/* Content Area */}
      <div className="flex-grow p-3 bg-neutral-100 h-screen">
        {/* Header */}
        <div className="flex justify-between items-center mb-2 bg-indigo-200 ">
          {/* Page Title */}
          <div className="text-3xl font-bold"></div>

          {/* Header Right Section */}
          <div className="flex items-center space-x-6 ">
            {/* Profile and Username */}
            <div className="flex items-center space-x-3 justify-between"></div>
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
}

export default SidebarMenu;
