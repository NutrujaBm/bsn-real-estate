import { useState } from "react";

function Password() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true); // Start loading

    if (formData.newPassword !== formData.confirmNewPassword) {
      setError("รหัสผ่านใหม่ไม่ตรงกัน");
      setLoading(false); // Stop loading
      return;
    }

    // Optionally, add password strength validation here
    if (formData.newPassword.length < 8) {
      setError("รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/user/update-password/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldPassword: formData.currentPassword,
          password: formData.newPassword,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.message || "เกิดข้อผิดพลาด");
        setLoading(false); // Stop loading
        return;
      }

      setSuccess(true);
      setLoading(false); // Stop loading
    } catch (error) {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
      setLoading(false); // Stop loading
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
        {loading && <p className="text-gray-500 mb-4">กำลังโหลด...</p>}{" "}
        {/* Loading indicator */}
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
