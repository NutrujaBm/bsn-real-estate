import React, { useState, useEffect } from "react";

function NotificationHistory() {
  const [notification, setNotifications] = useState([]); // เก็บข้อมูลการแจ้งเตือน
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ดึงข้อมูลการแจ้งเตือนจาก API
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/notification"); // API สำหรับดึงข้อมูลการแจ้งเตือนทั้งหมด
        const data = await response.json();
        setNotifications(data); // เก็บข้อมูลการแจ้งเตือนใน state
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลการแจ้งเตือน:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) {
    return <p>กำลังโหลดข้อมูล...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">ประวัติการแจ้งเตือน</h2>
      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">ข้อความ</th>
            <th className="border border-gray-300 px-4 py-2">ประเภท</th>
            <th className="border border-gray-300 px-4 py-2">
              โมเดลที่เกี่ยวข้อง
            </th>
            <th className="border border-gray-300 px-4 py-2">วันที่ส่ง</th>
            <th className="border border-gray-300 px-4 py-2">ผู้ใช้</th>
          </tr>
        </thead>
        <tbody>
          {notification.length > 0 ? (
            notification.map((notification) => (
              <tr key={notification._id}>
                <td className="border border-gray-300 px-4 py-2">
                  {notification._id}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {notification.message}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {notification.type}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {notification.relatedTo}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {notification.createdAt}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {notification.userId}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="6"
                className="border border-gray-300 px-4 py-2 text-center"
              >
                ไม่มีประวัติการแจ้งเตือน
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default NotificationHistory;
