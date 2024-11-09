import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

function Header() {
  const [activeLink, setActiveLink] = useState("/");

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  return (
    <header className="bg-white shadow-md py-2">
      <div className="flex justify-between max-w-7xl mx-auto items-center p-3">
        <Link to="/" onClick={() => handleLinkClick("/")}>
          <h1 className="font-bold text-lg sm:text-2xl flex items-center space-x-2">
            <img
              src="/logo.png"
              alt="BSN Real Estate Logo"
              className="h-12 sm:h-14"
            />
            <div className="flex flex-col text-left">
              <span className="hidden md:inline text-primary-600 text-md sm:text-xl leading-relaxed tracking-wide">
                BSN
              </span>
              <span className="hidden md:inline text-slate-700 text-sm sm:text-base leading-relaxed tracking-wide">
                Real Estate
              </span>
            </div>
          </h1>
        </Link>

        <ul className="flex gap-4 md:gap-8">
          <Link to="/" onClick={() => handleLinkClick("/")}>
            <li
              className={`hidden md:inline py-2 px-3 rounded w-full text-center ${
                activeLink === "/"
                  ? "text-blue-700"
                  : "text-gray-900 hover:text-blue-700"
              }`}
            >
              หน้าหลัก
            </li>
          </Link>

          <Link to="/properties" onClick={() => handleLinkClick("/properties")}>
            <li
              className={`hidden md:inline py-2 px-3 rounded w-full text-center ${
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
              className={`hidden md:inline py-2 px-3 rounded w-full text-center ${
                activeLink === "/contact"
                  ? "text-blue-700"
                  : "text-gray-900 hover:text-blue-700"
              }`}
            >
              ติดต่อเรา
            </li>
          </Link>
        </ul>

        <form className="flex items-center p-3 rounded-lg border border-gray-300">
          <FaSearch className="text-slate-600 mr-2" />
          <input
            type="text"
            placeholder="ค้นหา..."
            className="bg-transparent focus:outline-none w-24 sm:w-64 sm:px-2 text-base"
          />
        </form>

        <ul className="flex gap-4 md:gap-8">
          {/* <Link to="/register" onClick={() => handleLinkClick("/register")}>
            <li
              className={`hidden md:inline py-2 px-3 rounded w-full text-center ${
                activeLink === "/register"
                  ? "text-blue-700"
                  : "text-gray-900 hover:text-blue-700"
              }`}
            >
              สมัครสมาชิก
            </li>
          </Link> */}

          <Link to="/login" onClick={() => handleLinkClick("/login")}>
            <li
              className={`py-2 px-3 rounded w-full text-center ${
                activeLink === "/login"
                  ? "text-blue-700"
                  : "text-gray-900 hover:text-blue-700"
              }`}
            >
              เข้าสู่ระบบ
            </li>
          </Link>
        </ul>
      </div>
    </header>
  );
}

export default Header;
