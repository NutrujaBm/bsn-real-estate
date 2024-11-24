import React, { useState, useEffect } from "react";

function AdminReportList() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    // ตัวอย่างข้อมูลจำลอง (สามารถแทนที่ด้วยการดึงข้อมูลจาก API)
    const fetchReports = async () => {
      const data = [
        { id: 1, title: "แอปค้าง", status: "รอดำเนินการ", type: "เทคนิค" },
        {
          id: 2,
          title: "ปัญหาการชำระเงิน",
          status: "แก้ไขแล้ว",
          type: "การเงิน",
        },
      ];
      setReports(data);
    };
    fetchReports();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">รายการปัญหาที่รายงาน</h2>
      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">หัวข้อ</th>
            <th className="border border-gray-300 px-4 py-2">ประเภท</th>
            <th className="border border-gray-300 px-4 py-2">สถานะ</th>
            <th className="border border-gray-300 px-4 py-2">การจัดการ</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.id}>
              <td className="border border-gray-300 px-4 py-2">{report.id}</td>
              <td className="border border-gray-300 px-4 py-2">
                {report.title}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {report.type}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {report.status}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <button className="bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600">
                  แก้ไขแล้ว
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminReportList;
