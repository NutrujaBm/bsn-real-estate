import React from "react";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

function Header() {
  return (
    <header className="bg-white shadow-md py-2">
      <div className="flex justify-between max-w-7xl mx-auto items-center p-3">
        <Link>
          <h1 className="font-bold text-lg sm:text-2xl flex items-center space-x-2">
            <img
              src="/logo.png"
              alt="BSN Real Estate Logo"
              className="h-12 sm:h-14"
            />
            <div className="flex flex-col text-left">
              <span className="text-primary-600 text-sm sm:text-xl leading-relaxed tracking-wide">
                BSN
              </span>
              <span className="text-slate-700 text-xs sm:text-lg leading-relaxed tracking-wide">
                Real Estate
              </span>
            </div>
          </h1>
        </Link>
        <ul className="flex gap-4">
          <Link to="/">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              หน้าหลัก
            </li>
          </Link>
          <Link to="/properties">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              รายการอสังหาริมทรัพย์
            </li>
          </Link>
          <Link to="/contact">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              ติดต่อเรา
            </li>
          </Link>
        </ul>
        <form className="flex items-center p-3 rounded-lg border border-gray-300">
          <input
            type="text"
            placeholder="ค้นหา..."
            className="bg-transparent focus:outline-none w-24 sm:w-64 sm:px-2 text-base"
          />
          <FaSearch className="text-slate-600 mr-2" />
        </form>
        <ul className="flex gap-4">
          <Link to="/register">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              สมัครสมาชิก
            </li>
          </Link>
          <Link to="/login">
            <li className="text-slate-700 hover:underline">เข้าสู่ระบบ</li>
          </Link>
        </ul>
      </div>
    </header>
  );
}

export default Header;
