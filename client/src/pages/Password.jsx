import { useState, useContext } from "react";
import { useSelector } from "react-redux";

function Password() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    if (formData.newPassword !== formData.confirmNewPassword) {
      setError("รหัสผ่านใหม่ไม่ตรงกัน");
      setLoading(false);
      return;
    }

    if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(formData.newPassword)) {
      setError(
        "รหัสผ่านต้องมีตัวพิมพ์ใหญ่ ตัวพิมพ์เล็ก และตัวเลขอย่างน้อย 8 ตัวอักษร"
      );
      setLoading(false);
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      setError("รหัสผ่านใหม่ต้องไม่เหมือนกับรหัสผ่านปัจจุบัน");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/user/update-password/${currentUser._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldPassword: formData.currentPassword,
          password: formData.newPassword,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "เกิดข้อผิดพลาด");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
    } catch (error) {
      console.error("Fetch error:", error);
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
      setLoading(false);
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
            name="currentPassword"
            placeholder="ใส่รหัสปัจจุบัน"
            className="border p-3 rounded-lg text-base w-full"
            value={formData.currentPassword}
            onChange={handleChange}
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-base font-medium text-gray-900">
            รหัสผ่านใหม่
          </label>
          <input
            type="password"
            name="newPassword"
            placeholder="ใส่รหัสผ่านใหม่"
            className="border p-3 rounded-lg text-base w-full"
            value={formData.newPassword}
            onChange={handleChange}
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-base font-medium text-gray-900">
            ยืนยันรหัสผ่านใหม่
          </label>
          <input
            type="password"
            name="confirmNewPassword"
            placeholder="ยืนยันรหัสผ่านใหม่"
            className="border p-3 rounded-lg text-base w-full"
            value={formData.confirmNewPassword}
            onChange={handleChange}
          />
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && (
          <p className="text-green-500 mb-4">เปลี่ยนรหัสผ่านสำเร็จ!</p>
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
