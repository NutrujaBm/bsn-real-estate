import React, { useState } from "react";
import { set } from "mongoose";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

function Register() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    console.log(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);

      if (data.success == false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate("/login");
    } catch (error) {
      setLoading(false);
      setError(data.message);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold mt-16">สมัครสมาชิก</h1>
      <p className="text-center text-zinc-500 dark:text-zinc-400 mt-2 mb-10 text-lg">
        สร้างบัญชีฟรีด้วยอีเมลของคุณ
      </p>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label
            htmlFor="username"
            className="block mb-2 text-base font-medium text-gray-900 dark:text-white"
          >
            ชื่อผู้ใช้
          </label>
          <input
            type="text"
            id="username"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="กรุณากรอกชื่อผู้ใช้"
            required
            onChange={handleChange}
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="email"
            className="block mb-2 text-base font-medium text-gray-900 dark:text-white"
          >
            อีเมล
          </label>
          <input
            type="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="example@gmail.com"
            required
            onChange={handleChange}
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block mb-2 text-base font-medium text-gray-900 dark:text-white"
          >
            รหัสผ่าน
          </label>
          <input
            type="password"
            id="password"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="กรุณากรอกรหัสผ่านที่มีความยาวอย่างน้อย 8 ตัวอักษร"
            required
            onChange={handleChange}
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="confirm_password"
            className="block mb-2 text-base font-medium text-gray-900 dark:text-white"
          >
            ยืนยันรหัสผ่าน
          </label>
          <input
            type="password"
            id="confirm_password"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="ยืนยันรหัสผ่านให้ตรงกับรหัสผ่านที่กรอกไว้ก่อนหน้านี้"
            required
            // onChange={handleChange}
          />
        </div>
        <div className="flex items-center  mb-5">
          <div className="flex items-center h-5">
            <input
              id="terms"
              type="checkbox"
              value=""
              className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
              required
            />
          </div>
          <label
            htmlFor="terms"
            className="ml-2 text-base text-gray-900 dark:text-gray-300"
          >
            ยอมรับเงื่อนไขข้อตกลง{" "}
            <a href="#" className="text-blue-600 underline dark:text-blue-500">
              คลิกที่นี่
            </a>
            <span className="mx-1">เพื่ออ่าน</span>
          </label>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-5 text-lg text-white bg-[#5ece4f] rounded-lg mt-2 cursor-pointer font-medium"
        >
          {loading ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
        </button>
      </form>
      <div className="text-center mt-7">
        <p className="text-base">
          มีบัญชีอยู่แล้ว?
          <Link to={"/login"}>
            <span className="text-blue-600 font-semibold hover:underline text-base">
              {" "}
              เข้าสู่ระบบ
            </span>
          </Link>
        </p>
      </div>
      <p className="text-center text-base mt-10 mb-5">หรือ</p>
      <OAuth />
      {error && <p className="text-red-500 m">{error}</p>}
    </div>
  );
}

export default Register;
