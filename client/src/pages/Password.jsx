import { useState } from "react";
import { useSelector } from "react-redux";

function Password() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const { currentUser, loading, error } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccess(false);

    const { currentPassword, newPassword, confirmNewPassword } = formData;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setMessage("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    if (newPassword.length < 8) {
      setMessage("รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 8 ตัวอักษร");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setMessage("รหัสผ่านใหม่และการยืนยันไม่ตรงกัน");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId"); // หาค่า userId จาก localStorage
      if (!userId) {
        setMessage("ไม่พบข้อมูลผู้ใช้");
        return;
      }

      // แก้ไข URL ให้ตรงกับ userId ที่ได้จาก localStorage
      const res = await fetch(
        `http://localhost:3000/api/user/update-password/${userId}`,
        {
          method: "PUT", // เปลี่ยนจาก "POST" เป็น "PUT" ตามที่ API ต้องการ
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ใช้ token จาก localStorage
          },
          body: JSON.stringify({
            oldPassword: currentPassword,
            password: newPassword,
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน"
        );
      }

      setMessage("เปลี่ยนรหัสผ่านสำเร็จ!");
      setSuccess(true);

      // ลบข้อความหลังจาก 3 วินาที
      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      setMessage(error.message || "เกิดข้อผิดพลาดในการเชื่อมต่อ");
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-center my-6">เปลี่ยนรหัสผ่าน</h1>
      {message && (
        <p
          className={`text-center mb-4 ${
            success ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            รหัสผ่านปัจจุบัน
          </label>
          <input
            type="password"
            name="currentPassword"
            placeholder="ใส่รหัสผ่านปัจจุบัน"
            value={formData.currentPassword}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            รหัสผ่านใหม่
          </label>
          <input
            type="password"
            name="newPassword"
            placeholder="ใส่รหัสผ่านใหม่"
            value={formData.newPassword}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            ยืนยันรหัสผ่านใหม่
          </label>
          <input
            type="password"
            name="confirmNewPassword"
            placeholder="ยืนยันรหัสผ่านใหม่"
            value={formData.confirmNewPassword}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:opacity-90"
        >
          เปลี่ยนรหัสผ่าน
        </button>
      </form>
    </div>
  );
}

export default Password;
