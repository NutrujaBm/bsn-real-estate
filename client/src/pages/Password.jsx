import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

function Password() {
  // ใช้ useSelector เพื่อนำ currentUser จาก Redux store
  const currentUser = useSelector((state) => state.user.currentUser);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ตรวจสอบว่า รหัสผ่านใหม่และยืนยันรหัสผ่านตรงกันหรือไม่
    if (newPassword !== confirmPassword) {
      setError("รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }

    try {
      // ส่งคำขอไปยัง API สำหรับการอัปเดตรหัสผ่าน
      const response = await axios.put(
        `/api/user/update-password/${currentUser._id}`, // เพิ่มเครื่องหมาย / ก่อน currentUser._id
        {
          currentPassword,
          newPassword,
          confirmPassword,
        }
      );
      setSuccessMessage(response.data.message);
      setError("");

      // แสดงการแจ้งเตือนสำเร็จแล้วลบข้อความหลังจาก 3 วินาที
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000); // 3000ms = 3 วินาที
    } catch (err) {
      setError(
        err.response.data.message || "เกิดข้อผิดพลาดในการอัพเดตรหัสผ่าน"
      );
      setSuccessMessage("");
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        เปลี่ยนรหัสผ่าน
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block mb-2 text-base font-medium text-gray-900">
            รหัสผ่านปัจจุบัน
          </label>
          <input
            type="password"
            id="currentPassword"
            placeholder="ใส่รหัสปัจจุบัน"
            className="border p-3 rounded-lg text-base w-full"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-base font-medium text-gray-900">
            รหัสผ่านใหม่
          </label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            placeholder="ใส่รหัสผ่านใหม่"
            className="border p-3 rounded-lg text-base w-full"
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-base font-medium text-gray-900">
            ยืนยันรหัสผ่านใหม่
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            placeholder="ยืนยันรหัสผ่านใหม่"
            className="border p-3 rounded-lg text-base w-full"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        {loading && <p className="text-gray-500 mb-4">กำลังโหลด...</p>}
        <button
          type="submit"
          className="bg-blue-600 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
        >
          เปลี่ยนรหัสผ่าน
        </button>
      </form>
    </div>
  );
}

export default Password;
