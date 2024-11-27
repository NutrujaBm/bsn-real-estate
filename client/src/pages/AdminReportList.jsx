import React, { useState, useEffect } from "react";

function AdminReportList() {
  const [reports, setReports] = useState([]);
  const [notification, setNotification] = useState(""); // ข้อความแจ้งเตือน
  const [selectedUser, setSelectedUser] = useState(""); // ผู้ใช้ที่เลือก
  const [notificationType, setNotificationType] = useState("");
  const [notificationStatus, setNotificationStatus] = useState(""); // สถานะการแจ้งเตือน
  const [relatedModel, setRelatedModel] = useState(""); // โมเดลที่เกี่ยวข้อง
  const [users, setUsers] = useState([]); // เก็บข้อมูลผู้ใช้

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/user/all");
        const data = await response.json();

        // ตรวจสอบว่า data เป็น array หรือไม่
        if (Array.isArray(data)) {
          setUsers(data); // เก็บข้อมูลผู้ใช้ลงใน state
        } else {
          console.error("ข้อมูลผู้ใช้ไม่ใช่รูปแบบที่คาดหวัง");
          setUsers([]); // กรณีที่ข้อมูลไม่ถูกต้อง
        }
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้:", error);
      }
    };

    fetchUsers();
  }, []);

  const sendNotification = async () => {
    if (
      !notification ||
      (!selectedUser && selectedUser !== "all") ||
      !notificationType ||
      !relatedModel
    ) {
      alert(
        "กรุณากรอกข้อความ, เลือกผู้ใช้, เลือกประเภทการแจ้งเตือน หรือเลือกโมเดลที่เกี่ยวข้อง"
      );
      return;
    }

    setNotificationStatus("กำลังส่ง...");

    try {
      if (selectedUser === "all") {
        // ส่งข้อความไปยังผู้ใช้ทุกคน
        console.log("ส่งข้อความแจ้งเตือนไปยังผู้ใช้ทุกคน: ", notification);
        for (const user of users) {
          console.log(
            `ส่งข้อความไปยังผู้ใช้ ID: ${user._id} ชื่อ: ${user.username}`
          );

          const response = await fetch("/api/notification/create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: user._id,
              message: notification,
              type: notificationType, // ส่งค่า type ที่เลือก
              relatedTo: relatedModel, // ส่งค่า relatedModel ที่เลือก
            }),
          });

          const data = await response.json();
          console.log("การแจ้งเตือนถูกสร้างแล้ว:", data);
        }
      } else {
        // ส่งข้อความไปยังผู้ใช้ที่เลือก
        const selectedUserData = users.find(
          (user) => user._id === selectedUser
        );
        if (selectedUserData) {
          console.log(
            `ส่งข้อความไปยังผู้ใช้ ID: ${selectedUserData._id} ชื่อ: ${selectedUserData.username}`
          );
          console.log("ส่งข้อความแจ้งเตือนไปยังผู้ใช้: ", notification);

          const response = await fetch("/api/notification/create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: selectedUserData._id,
              message: notification,
              type: notificationType, // ส่งค่า type ที่เลือก
              relatedTo: relatedModel, // ส่งค่า relatedModel ที่เลือก
            }),
          });

          const data = await response.json();
          console.log("การแจ้งเตือนถูกสร้างแล้ว:", data);
        } else {
          console.error("ไม่พบผู้ใช้ที่เลือก");
        }
      }

      setTimeout(() => {
        setNotificationStatus("ส่งสำเร็จ");
        setNotification(""); // รีเซ็ตข้อความแจ้งเตือน
        setSelectedUser(""); // รีเซ็ตผู้ใช้ที่เลือก
        setNotificationType(""); // รีเซ็ตประเภทแจ้งเตือน
        setRelatedModel(""); // รีเซ็ตโมเดลที่เลือก
      }, 2000);
    } catch (error) {
      setNotificationStatus("เกิดข้อผิดพลาดในการส่ง");
      console.error("เกิดข้อผิดพลาดในการส่ง:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">รายการปัญหาที่รายงาน</h2>
      <div className="mt-6">
        <h3 className="text-xl font-bold mb-4">ส่งแจ้งเตือน</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            เลือกผู้ใช้
          </label>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="">เลือกผู้ใช้</option>
            <option value="all">ทุกคน</option>
            {users.length > 0 ? (
              users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.username}
                </option>
              ))
            ) : (
              <option value="">ไม่มีผู้ใช้</option>
            )}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            เลือกประเภทการแจ้งเตือน
          </label>
          <select
            value={notificationType}
            onChange={(e) => setNotificationType(e.target.value)}
            className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="">เลือกประเภทการแจ้งเตือน</option>
            <option value="info">แจ้งข้อมูลทั่วไป</option>
            <option value="warning">แจ้งเตือนที่ต้องระวัง</option>
            <option value="error">แจ้งข้อผิดพลาด</option>
            <option value="success">แจ้งดำเนินการเสร็จสิ้น</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            เลือกโมเดลที่เกี่ยวข้อง
          </label>
          <select
            value={relatedModel}
            onChange={(e) => setRelatedModel(e.target.value)}
            className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="">เลือกโมเดลที่เกี่ยวข้อง</option>
            <option value="report">รายงาน</option>
            <option value="post">โพสต์</option>
            <option value="user">ผู้ใช้</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            ข้อความแจ้งเตือน
          </label>
          <textarea
            value={notification}
            onChange={(e) => setNotification(e.target.value)}
            className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md"
            rows="4"
            placeholder="กรอกข้อความที่ต้องการส่ง..."
          />
        </div>
        <button
          onClick={sendNotification}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          ส่งแจ้งเตือน
        </button>
        {notificationStatus && (
          <p className="mt-4 text-sm text-gray-600">{notificationStatus}</p>
        )}
      </div>
    </div>
  );
}

export default AdminReportList;
