import { useState } from "react";

function Password() {
<<<<<<< HEAD
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handlePasswordChange = async () => {
    setMessage(""); // Reset message
    setSuccess(false); // Reset success status

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("รหัสผ่านใหม่และการยืนยันไม่ตรงกัน");
=======
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
>>>>>>> 016cb497cda9303f91f154dda3bb7ba9e945d3cb
      return;
    }

    try {
<<<<<<< HEAD
      const token = localStorage.getItem("token"); // สมมติว่ามี token เก็บใน localStorage
      const userId = "user_id"; // ใช้ userId จากระบบจริง

      const response = await fetch(`/api/users/update-password/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ส่ง token เพื่อยืนยันตัวตน
        },
        body: JSON.stringify({
          oldPassword: currentPassword,
          password: newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน");
      }

      setMessage("เปลี่ยนรหัสผ่านสำเร็จ!");
      setSuccess(true);
    } catch (error) {
      setMessage(error.message);
=======
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
>>>>>>> 016cb497cda9303f91f154dda3bb7ba9e945d3cb
    }
  };

  return (
<<<<<<< HEAD
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-center my-6">เปลี่ยนรหัสผ่าน</h1>
      {message && (
        <p className={`text-center mb-4 ${success ? "text-green-600" : "text-red-600"}`}>
          {message}
        </p>
      )}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          รหัสผ่านปัจจุบัน
        </label>
        <input
          type="password"
          placeholder="ใส่รหัสผ่านปัจจุบัน"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full p-3 border rounded-lg"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          รหัสผ่านใหม่
        </label>
        <input
          type="password"
          placeholder="ใส่รหัสผ่านใหม่"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-3 border rounded-lg"
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">
          ยืนยันรหัสผ่านใหม่
        </label>
        <input
          type="password"
          placeholder="ยืนยันรหัสผ่านใหม่"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-3 border rounded-lg"
        />
      </div>
      <button
        onClick={handlePasswordChange}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:opacity-90"
      >
        เปลี่ยนรหัสผ่าน
      </button>
=======
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
>>>>>>> 016cb497cda9303f91f154dda3bb7ba9e945d3cb
    </div>
  );
}

export default Password;
