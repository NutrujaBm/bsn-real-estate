import React, { useState } from "react";
import { Routes, Route, useLocation, Link } from "react-router-dom";
import Dashboard from "../pages/AdminDashboard";
import UserManagement from "../pages/UserManagement";
import PropertyManagement from "../pages/PropertyManagement";
import AdminReportPage from "../pages/AdminReportPage";
import { useSelector } from "react-redux";
import AdminReportList from "../pages/AdminReportList";
import {
  FaAngleDown,
  FaAngleUp,
  FaClipboardList,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";

const SidebarMenu = () => {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isListMenuOpen, setIsListMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("/");

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const toggleAccountMenu = () => {
    setIsAccountMenuOpen((prev) => !prev);
  };

  const toggleListMenu = () => {
    setIsListMenuOpen((prev) => !prev);
  };

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  const handleLogout = async () => {
    try {
      dispatch(logoutUserStart());
      const res = await fetch(`/api/auth/logout`);
      const data = await res.json();

      if (data.success === false) {
        dispatch(logoutUserFailure(data.message));
        return;
      }

      dispatch(logoutUserSuccess(data));
    } catch (error) {
      dispatch(logoutUserFailure(error.message));
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
          <li>
            <a
              href="/admin/notification-history"
              className="p-4 block hover:bg-gray-200 text-base"
            >
              ดูประวัติการแจ้งเตือน
            </a>
          </li>

          <li>
            <a
              href="#"
              className="block px-4 py-4 mt-10 text-base text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white border-y"
              onClick={toggleAccountMenu}
            >
              <FaUser className="inline mr-2" />
              บัญชี
              {isAccountMenuOpen ? (
                <FaAngleUp className="inline ml-30 sm:ml-35" />
              ) : (
                <FaAngleDown className="inline ml-30 sm:ml-35" />
              )}
            </a>
            {isAccountMenuOpen && (
              <ul className="mt-2 bg-gray-100 p-2">
                <li>
                  <Link
                    to="/profile"
                    onClick={() => {
                      closeDropdown();
                      handleLinkClick("/profile");
                    }}
                    className="block px-8 py-4 text-gray-700 hover:bg-gray-200 border-b"
                  >
                    แก้ไขโปรไฟล์
                  </Link>
                </li>
                <li>
                  <Link
                    to="/profile/password"
                    onClick={() => {
                      closeDropdown();
                      handleLinkClick("/profile/password");
                    }}
                    className="block px-8 py-4 text-gray-700 hover:bg-gray-200"
                  >
                    เปลี่ยนรหัสผ่าน
                  </Link>
                </li>
              </ul>
            )}
          </li>

          <li>
            <a
              href="#"
              className="block px-4 py-4 text-base text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white border-b"
              onClick={toggleListMenu}
            >
              <FaClipboardList className="inline mr-2" />
              โพสต์อสังหาริมทรัพย์
              {isListMenuOpen ? (
                <FaAngleUp className="inline  ml-5 sm:ml-10" />
              ) : (
                <FaAngleDown className="inline  ml-5 sm:ml-10" />
              )}
            </a>
            {isListMenuOpen && (
              <ul className="mt-2 bg-gray-100 p-2">
                <li>
                  <Link
                    to="/create-listing"
                    onClick={() => {
                      closeDropdown();
                      handleLinkClick("/profile");
                    }}
                    className="block px-8 py-4 text-gray-700 hover:bg-gray-200 border-b"
                  >
                    สร้างโพสต์อสังหาริมทรัพย์
                  </Link>
                </li>
                <li>
                  <Link
                    to="/show-listing"
                    onClick={() => {
                      closeDropdown();
                      handleLinkClick("/profile/password");
                    }}
                    className="block px-8 py-4 text-gray-700 hover:bg-gray-200"
                  >
                    รายการอสังหาริมทรัพย์
                  </Link>
                </li>
              </ul>
            )}
          </li>
        </ul>
        <ul className="flex-grow p-3">
          <li>
            <li>
              <span
                className="block px-4 py-4 mt-80 text-base text-red-500 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white cursor-pointer"
                onClick={handleLogout}
              >
                <FaSignOutAlt className="inline mr-2" />
                ออกจากระบบ
              </span>
            </li>
          </li>
        </ul>
      </div>

      {/* Content Area */}
      <div className="flex-grow p-3 bg-neutral-100">
        {/* Header */}
        <div className="flex justify-between items-center mb-2 bg-indigo-200">
          {/* Page Title */}
          <div className="text-3xl font-bold"></div>

          {/* Header Right Section */}
          <div className="flex items-center space-x-6 ">
            {/* Profile and Username */}
            <div className="flex items-center space-x-3">
              <span className="text-xl">
                ยินดีต้อนรับ ผู้ดูแลระบบ!
                <p>{currentUser.username}</p>
              </span>{" "}
              {/* Username */}
              <button className="p-2 bg-gray-700 rounded-full">
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
