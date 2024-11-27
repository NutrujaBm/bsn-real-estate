import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaInfoCircle } from "react-icons/fa"; // นำเข้าไอคอน
import { FaLine } from "react-icons/fa6";
import { FaPhoneSquareAlt } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { IoIosClose } from "react-icons/io";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // สำหรับเก็บข้อมูลผู้ใช้ที่เลือก
  const [isModalOpen, setIsModalOpen] = useState(false); // สำหรับเปิดปิด popup
  const [newRole, setNewRole] = useState(""); // สำหรับเก็บบทบาทใหม่ที่จะแก้ไข

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/user/all"); // เปลี่ยน URL ตามที่ตั้งของ API
        const sortedUsers = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        ); // เรียงข้อมูลตามวันที่สมัครสมาชิก (ใหม่สุด -> เก่าสุด)
        setUsers(sortedUsers);
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
      <h1 className="text-2xl font-bold text-center mb-6">จัดการผู้ใช้งาน</h1>
      <div
        className="overflow-x-auto"
        style={{ maxHeight: "80vh", overflowY: "auto" }} // Set max height and enable scrolling
      >
        <table
          className="w-full border-collapse border border-gray-200 text-base"
          style={{ tableLayout: "fixed" }}
        >
          <thead>
            <tr className="bg-gray-100">
              <th
                className="border border-gray-200 px-4 py-2 text-center"
                style={{ width: "250px" }}
              >
                ชื่อผู้ใช้
              </th>
              <th
                className="border border-gray-200 px-4 py-2 text-center"
                style={{ width: "180px" }}
              >
                รูปโปรไฟล์
              </th>
              <th
                className="border border-gray-200 px-4 py-2 text-center"
                style={{ width: "250px" }}
              >
                อีเมล
              </th>
              <th
                className="border border-gray-200 px-4 py-2 text-center"
                style={{ width: "180px" }}
              >
                เบอร์โทรศัพท์
              </th>
              <th
                className="border border-gray-200 px-4 py-2 text-center"
                style={{ width: "120px" }}
              >
                บทบาท
              </th>
              <th
                className="border border-gray-200 px-4 py-2 text-center"
                style={{ width: "180px" }}
              >
                วันที่สมัครสมาชิก
              </th>
              <th
                className="border border-gray-200 px-4 py-2 text-center"
                style={{ width: "180px" }}
              >
                วันที่ปรับปรุงโปรไฟล์
              </th>
              <th
                className="border border-gray-200 px-4 py-2 text-center"
                style={{ width: "150px" }}
              >
                จัดการ
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td className="border border-gray-200 px-4 py-2">
                  {user.username}
                </td>
                <td className="border border-gray-200 px-15 py-2 ">
                  <img
                    src={user.avatar}
                    alt="avatar"
                    className="w-12 h-12 rounded-full"
                  />
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  {user.email}
                </td>
                <td className="border border-gray-200 px-4 py-2 text-center">
                  {user.phone || "-"}
                </td>

                <td className="border border-gray-200 px-4 py-2 text-center">
                  {user.role === "admin" ? "ผู้ดูแลระบบ" : "สมาชิก"}
                </td>
                <td className="border border-gray-200 px-4 py-2 text-center">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("th-TH", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "ไม่มี"}
                </td>
                <td className="border border-gray-200 px-4 py-2 text-center">
                  {user.updatedAt
                    ? new Date(user.updatedAt).toLocaleDateString("th-TH", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "ไม่มี"}
                </td>
                <td className="border border-gray-200 px-15 py-2 ">
                  <div className="group relative">
                    <button
                      className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600"
                      onClick={() => openModal(user)}
                    >
                      <FaInfoCircle />
                    </button>
                    <span className="absolute left-1/2 text-center w-30 transform -translate-x-1/2 bottom-12 text-base text-white bg-gray-700 bg-opacity-80 rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      ดูรายละเอียด
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Popup Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
          <div className="bg-white p-6 rounded-lg w-[740px] h-[700px] relative">
            <div className="mb-4">
              <div className="border-y border-black border-opacity-10 py-2">
                <p className="text-base font-medium">รายละเอียดผู้ใช้</p>
              </div>
              <div className="flex flex-col mt-6">
                <label className="flex items-center text-base mb-3 border-b pb-5">
                  <strong className="mr-2">บทบาท :</strong>
                  {selectedUser.role === "admin" ? "ผู้ดูแลระบบ" : "สมาชิก"}
                </label>
                <label className="flex items-center text-base mb-3">
                  <strong className="mr-2">ชื่อผู้ใช้ :</strong>
                  {selectedUser.username}
                </label>
                <label className="flex items-center text-base mb-3">
                  <strong className="mr-2">ชื่อ-นามสกุล :</strong>
                  {selectedUser.firstName && selectedUser.lastName
                    ? `${selectedUser.firstName} ${selectedUser.lastName}`
                    : "-"}
                </label>
                <label className="flex items-center text-base mb-3 border-b pb-5">
                  <strong className="mr-2">เกี่ยวกับฉัน :</strong>
                  <textarea
                    value={selectedUser.aboutMe || "-"} // แสดงข้อความใน selectedUser.aboutMe หรือ - หากไม่มีข้อมูล
                    readOnly // ทำให้ textarea เป็น read-only (ไม่สามารถแก้ไขได้)
                    rows="4" // กำหนดจำนวนแถวของ textarea
                    className="w-[600px] p-2 border border-gray-300 rounded" // สไตล์ CSS ของ textarea
                  />
                </label>

                <label className="flex items-center text-base mb-3 border-b pb-5">
                  <strong className="mr-2">ที่อยู่ :</strong>
                  {selectedUser.address}
                </label>

                <label className="flex items-center text-base mb-3 pb-5">
                  <strong className="mr-2">
                    <MdOutlineEmail className="mr-2 text-gray-700 w-6 h-6" />
                  </strong>
                  | {selectedUser.email}
                </label>
                <label className="flex items-center text-base mb-3 pb-5">
                  <strong className="mr-2">
                    {" "}
                    <FaPhoneSquareAlt className="mr-2 text-gray-700 w-6 h-6" />
                  </strong>
                  | {selectedUser.phone || "-"}
                </label>
                <label className="flex items-center text-base mb-3 border-b pb-5">
                  <strong className="mr-2">
                    {" "}
                    <FaLine className="mr-2 text-gray-700 w-6 h-6" />
                  </strong>
                  | {selectedUser.lineId || "-"}
                </label>

                <label className="flex items-center text-base mb-3 pb-5">
                  <strong className="mr-2">วันที่สมัครสมาชิก :</strong>
                  {selectedUser.createdAt
                    ? new Date(selectedUser.createdAt).toLocaleDateString(
                        "th-TH",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )
                    : "ไม่มี"}
                </label>
                <label className="flex items-center text-base mb-3  pb-5">
                  <strong className="mr-2">วันที่ปรับปรุงล่าสุด :</strong>
                  {selectedUser.updatedAt
                    ? new Date(selectedUser.updatedAt).toLocaleDateString(
                        "th-TH",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )
                    : "ไม่มี"}
                </label>

                <button
                  onClick={closeModal}
                  className="absolute top-6 right-3 text-gray-700"
                >
                  <IoIosClose className="w-10 h-10" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
