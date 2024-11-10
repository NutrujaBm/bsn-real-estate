import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../redux/user/userSlice.js";
import OAuth from "../components/OAuth.jsx";

function Login() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    console.log(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(loginStart());
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);

      if (data.success == false) {
        dispatch(loginFailure(data.message));
        return;
      }

      dispatch(loginSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(loginFailure(error.message));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold mt-16">เข้าสู่ระบบ</h1>
      <p className="text-center text-zinc-500 dark:text-zinc-400 mt-2 mb-10 text-lg">
        เริ่มต้นใช้งานเว็ปไซต์ของเรา ด้วยการสร้างบัญชีใหม่
      </p>
      <form onSubmit={handleSubmit}>
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
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center h-5">
            <input
              id="remember"
              type="checkbox"
              value=""
              className="w-4 h-4 mr-3 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
              required
            />
            <label
              htmlFor="remember"
              className="text-base text-gray-900 dark:text-gray-300"
            >
              จดจำฉันไว้
            </label>
          </div>
          <p className="text-blue-600 hover:underline text-base ml-4">
            ลืมรหัสผ่าน?
          </p>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-5 text-lg text-white bg-[#5ece4f] rounded-lg mt-2 cursor-pointer font-medium"
        >
          {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </button>
      </form>
      <div className="text-center mt-7">
        <p className="text-base">
          คุณไม่มีบัญชีใช่ไหม?
          <Link to={"/register"}>
            <span className="text-blue-600 font-semibold hover:underline text-base">
              {" "}
              สมัครสมาชิก
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

export default Login;
