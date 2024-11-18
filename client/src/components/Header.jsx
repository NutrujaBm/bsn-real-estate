import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaAngleDown,
  FaAngleUp,
  FaUser,
  FaBell,
  FaSignOutAlt,
  FaClipboardList,
} from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import {
  logoutUserFailure,
  logoutUserStart,
  logoutUserSuccess,
} from "../redux/user/userSlice.js";

function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

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
    <header className="bg-gradient-to-r from-[#C9D9FF] to-[#F89B9E] shadow-md py-2">
      {/* Rest of the content */}
      <div className="flex justify-between max-w-7xl mx-auto items-center p-3">
        <Link to="/" onClick={() => handleLinkClick("/")}>
          <h1 className="font-bold text-lg sm:text-2xl flex items-center space-x-2">
            <img
              src="/logo.png"
              alt="BSN Real Estate Logo"
              className="h-20 sm:h-20"
            />
            <div className="flex flex-col text-left mt-0">
              <span className="hidden md:inline text-primary-600 text-md sm:text-xl leading-relaxed tracking-wide text-yellow-500 belanosima-regular">
                BSN
              </span>
              <span className="hidden md:inline text-sm sm:text-sm leading-relaxed tracking-wide text-indigo-500 belanosima-regular">
                REAL ESTATE
              </span>
            </div>
          </h1>
        </Link>

        <ul className="flex gap-4 md:gap-8">
          <Link to="/" onClick={() => handleLinkClick("/")}>
            <li
              className={`hidden lg:inline text-lg font-semibold py-2 px-3 rounded w-full text-center${
                activeLink === "/"
                  ? "text-blue-700"
                  : "text-gray-900 hover:text-blue-700"
              }`}
            >
              หน้าหลัก
            </li>
          </Link>

          <Link to="/search" onClick={() => handleLinkClick("/search")}>
            <li
              className={`hidden lg:inline text-lg font-semibold py-2 px-3 rounded w-full text-center${
                activeLink === "/properties"
                  ? "text-blue-700"
                  : "text-gray-900 hover:text-blue-700"
              }`}
            >
              รายการอสังหาริมทรัพย์
            </li>
          </Link>

          <Link to="/contact" onClick={() => handleLinkClick("/contact")}>
            <li
              className={`hidden lg:inline text-lg font-semibold py-2 px-3 rounded w-full text-center${
                activeLink === "/contact"
                  ? "text-blue-700"
                  : "text-gray-900 hover:text-blue-700"
              }`}
            >
              ติดต่อเรา
            </li>
          </Link>
        </ul>

        <ul className="flex gap-4 md:gap-8">
          <form className="flex items-center p-3 rounded-lg border border-gray-300 focus-within:border-blue-500">
            <FaSearch className="text-slate-600 mr-2 " />
            <input
              type="text"
              id="search-navbar"
              placeholder="ค้นหา..."
              className="bg-transparent focus:outline-none w-24 md:w-48 md:px-2 text-base"
            />
          </form>
          <Link onClick={toggleDropdown} className="flex items-center">
            {currentUser ? (
              <>
                <img
                  src={currentUser.avatar}
                  alt="avatar"
                  className="w-10 h-10 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500"
                />
                <span className="ml-2 text-gray-700 text-lg">
                  {currentUser.username}
                </span>
                {isDropdownOpen ? (
                  <FaAngleUp className="ml-2" />
                ) : (
                  <FaAngleDown className="ml-2" />
                )}
              </>
            ) : (
              <li className="py-2 px-3 rounded w-full text-center">
                <Link to="/login">เข้าสู่ระบบ</Link>
              </li>
            )}
          </Link>

          {isDropdownOpen && currentUser && (
            <div
              className="z-50 absolute top-22 right-80 text-base list-none border bg-white divide-y divide-gray-300 rounded-lg shadow-lg"
              id="user-dropdown"
            >
              <div className="px-4 py-3">
                <span className="py-3 text-sm text-gray-900 dark:text-white">
                  {currentUser.username}
                </span>
                <span className="block font-medium truncate">
                  {currentUser.email}
                </span>
              </div>

              <ul className="py-2" aria-labelledby="user-menu-button">
                <li>
                  <a
                    href="#"
                    className="block px-4 py-4 text-base text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white border-b"
                    onClick={toggleAccountMenu}
                  >
                    <FaUser className="inline mr-2" />
                    บัญชี
                    {isAccountMenuOpen ? (
                      <FaAngleUp className="inline ml-35" />
                    ) : (
                      <FaAngleDown className="inline ml-35" />
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
                      <FaAngleUp className="inline ml-10" />
                    ) : (
                      <FaAngleDown className="inline ml-10" />
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

                <li>
                  <a
                    href="#"
                    className="block px-4 py-4 text-base text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white border-b"
                    onClick={closeDropdown}
                  >
                    <FaBell className="inline mr-2" />
                    การแจ้งเตือน
                  </a>
                </li>

                {currentUser ? (
                  currentUser.role === "admin" ? (
                    <>
                      <li>
                        <Link
                          to="/admin"
                          className="block px-4 py-4 text-base text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white border-b"
                        >
                          ภาพรวมของระบบ
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/admin/users"
                          className="block px-4 py-4 text-base text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white border-b"
                        >
                          ผู้ใช้งานภายในระบบ
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/admin/properties"
                          className="block px-4 py-4 text-base text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white border-b"
                        >
                          อสังหาริมทรัพย์ภายในระบบ
                        </Link>
                      </li>
                    </>
                  ) : null
                ) : null}

                <li>
                  <li>
                    <span
                      className="block px-4 py-4 text-base text-red-500 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white cursor-pointer"
                      onClick={handleLogout}
                    >
                      <FaSignOutAlt className="inline mr-2" />
                      ออกจากระบบ
                    </span>
                  </li>
                </li>
              </ul>
            </div>
          )}
        </ul>
      </div>
    </header>
  );
}

export default Header;
