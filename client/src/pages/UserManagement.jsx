import React, { useEffect, useState } from "react";
import axios from "axios";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // สำหรับเก็บข้อมูลผู้ใช้ที่เลือก
  const [isModalOpen, setIsModalOpen] = useState(false); // สำหรับเปิดปิด popup
  const [newRole, setNewRole] = useState(""); // สำหรับเก็บบทบาทใหม่ที่จะแก้ไข

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/user/all"); // เปลี่ยน URL ตามที่ตั้งของ API
        setUsers(response.data);
      } catch (err) {
        console.error("Failed to load users", err);
      }
    };

    fetchUsers();
  }, []);

  const openModal = (user) => {
    setSelectedUser(user);
    setNewRole(user.role); // ตั้งค่า role ของผู้ใช้ใน modal
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setNewRole(""); // รีเซ็ต role เมื่อปิด modal
  };

  const handleRoleChange = async () => {
    try {
      const updatedUser = { ...selectedUser, role: newRole };
      await axios.put(`/api/user/${selectedUser._id}/update`, updatedUser); // เปลี่ยน URL ตามที่ตั้งของ API
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === selectedUser._id ? { ...user, role: newRole } : user
        )
      );
      closeModal(); // ปิด modal หลังจากอัพเดตข้อมูล
    } catch (err) {
      console.error("Failed to update role", err);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">จัดการผู้ใช้งาน</h1>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">ชื่อผู้ใช้</th>
            <th className="px-4 py-2 text-left">อีเมล</th>
            <th className="px-4 py-2 text-left">ชื่อ-นามสกุล</th>
            <th className="px-4 py-2 text-left">เบอร์โทรศัพท์</th>
            <th className="px-4 py-2 text-left">บทบาท</th>
            <th className="px-4 py-2 text-left">รูปโปรไฟล์</th>
            <th className="px-4 py-2">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td className="px-4 py-2">{user.username}</td>
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2">
                {user.firstName} {user.lastName}
              </td>
              <td className="px-4 py-2">{user.phone}</td>
              <td className="px-4 py-2">{user.role}</td>
              <td className="px-4 py-2">
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="w-12 h-12 rounded-full"
                />
              </td>
              <td className="px-4 py-2">
                <button
                  onClick={() => openModal(user)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  ดูรายละเอียด
                </button>
                <button
                  onClick={() => openModal(user)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-md ml-2 hover:bg-yellow-600"
                >
                  แก้ไขบทบาท
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Popup Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">รายละเอียดผู้ใช้</h2>
            <div className="mb-2">
              <strong>ชื่อผู้ใช้: </strong>
              {selectedUser.username}
            </div>
            <div className="mb-2">
              <strong>อีเมล: </strong>
              {selectedUser.email}
            </div>
            <div className="mb-2">
              <strong>ชื่อ-นามสกุล: </strong>
              {selectedUser.firstName} {selectedUser.lastName}
            </div>
            <div className="mb-2">
              <strong>เบอร์โทรศัพท์: </strong>
              {selectedUser.phone}
            </div>
            <div className="mb-2">
              <strong>Line ID: </strong>
              {selectedUser.lineId}
            </div>
            <div className="mb-2">
              <strong>ที่อยู่: </strong>
              {selectedUser.address}
            </div>
            <div className="mb-2">
              <strong>บทบาท: </strong>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="border border-gray-300 rounded-md p-2 w-full"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleRoleChange}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              >
                บันทึก
              </button>
              <button
                onClick={closeModal}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
