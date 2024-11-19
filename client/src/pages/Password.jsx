import { useState } from "react";

function Password() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (formData.newPassword !== formData.confirmNewPassword) {
      setError("รหัสผ่านใหม่ไม่ตรงกัน");
      return;
    }

    try {
      const res = await fetch(`/api/user/update-password`, {
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
        return;
      }

      setSuccess(true);
    } catch (error) {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
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
