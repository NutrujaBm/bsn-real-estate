import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function AdminReportPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ดึงข้อมูลรายงานทั้งหมดจาก API
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get("/api/report");
        console.log(response.data); // ตรวจสอบข้อมูลที่ได้รับ
        setReports(response.data);
      } catch (err) {
        setError("ไม่สามารถดึงข้อมูลรายงานได้");
        console.error(err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // ฟังก์ชันสำหรับอัปเดตสถานะรายงาน
  const updateStatus = async (id, status) => {
    try {
      const response = await axios.put(`/api/report/${id}/status`, { status });
      setReports((prevReports) =>
        prevReports.map((report) =>
          report._id === id
            ? { ...report, status: response.data.data.status }
            : report
        )
      );
      alert("สถานะอัปเดตเรียบร้อย");
    } catch (err) {
      alert("เกิดข้อผิดพลาดในการอัปเดตสถานะ");
    }
  };

  // ฟังก์ชันสำหรับลบรายงาน
  const deleteReport = async (id) => {
    if (window.confirm("คุณแน่ใจว่าต้องการลบรายงานนี้?")) {
      try {
        await axios.delete(`/api/report/${id}`);
        setReports((prevReports) =>
          prevReports.filter((report) => report._id !== id)
        );
        alert("ลบรายงานสำเร็จ");
      } catch (err) {
        alert("เกิดข้อผิดพลาดในการลบรายงาน");
      }
    }
  };

  if (loading) return <div className="text-center py-10">กำลังโหลด...</div>;
  if (error)
    return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">การจัดการรายงาน</h1>
      {reports.length === 0 ? (
        <p className="text-center text-gray-500">ไม่มีรายงาน</p>
      ) : (
        <div
          className="overflow-x-auto"
          style={{ height: "100vh", overflowY: "hidden" }}
        >
          <table
            className="w-full border-collapse border border-gray-200 text-base"
            style={{ tableLayout: "fixed" }}
          >
            <thead>
              <tr className="bg-gray-100 text-center">
                <th className="border border-gray-200 px-4 py-2">ผู้รายงาน</th>
                <th className="border border-gray-200 px-4 py-2">กล่าวถึง</th>
                <th className="border border-gray-200 px-4 py-2">ประเภท</th>
                <th className="border border-gray-200 px-4 py-2">ปัญหา</th>
                <th
                  className="border border-gray-200 px-4 py-2"
                  style={{ width: "300px" }}
                >
                  เนื้อหาที่ถูกแจ้ง
                </th>
                <th className="border border-gray-200 px-4 py-2">สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report._id} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-4 py-2">
                    {report.reporter ? (
                      <Link
                        to={`/user-gallery/${report.reporter._id}`}
                        className="text-blue-500 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {report.reporter.username}
                      </Link>
                    ) : (
                      "ไม่ทราบ"
                    )}
                  </td>

                  <td className="border border-gray-200 px-4 py-2">
                    {/* ลิงก์ไปยังหน้ารายละเอียดตาม reportedEntity */}
                    {report.reportedEntity ? (
                      report.entityType === "listing" ? (
                        <Link
                          to={`/listing/${report.reportedEntity._id}`}
                          className="text-blue-500 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {report.reportedEntity.title || "ไม่ทราบ"}
                        </Link>
                      ) : report.entityType === "user" ? (
                        <Link
                          to={`/user-gallery/${report.reportedEntity._id}`}
                          className="text-blue-500 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {report.reportedEntity.username || "ไม่ทราบ"}
                        </Link>
                      ) : (
                        "ไม่ทราบ"
                      )
                    ) : (
                      "ไม่ทราบ"
                    )}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-center">
                    {report.entityType === "user"
                      ? "รายงานผู้ใช้"
                      : report.entityType === "listing"
                      ? "รายงานโพสต์"
                      : "ไม่ทราบ"}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {report.issueType === "incorrect-info"
                      ? "ข้อมูลไม่ถูกต้อง"
                      : report.issueType === "inappropriate-content"
                      ? "เนื้อหาที่ไม่เหมาะสม"
                      : report.issueType === "missing-information"
                      ? "ข้อมูลหาย"
                      : report.issueType === "fraudulent-post"
                      ? "โพสต์ที่ไม่ถูกต้อง"
                      : report.issueType === "impersonation"
                      ? "การแอบอ้าง"
                      : report.issueType === "hate-speech"
                      ? "การพูดที่สร้างความเกลียดชัง"
                      : report.issueType === "spam-and-fraud"
                      ? "สแปมและการโกง"
                      : report.issueType === "no-matching-issue"
                      ? "ไม่มีปัญหาที่ตรงกับตัวเลือก"
                      : report.issueType === "bug"
                      ? "บั๊กในระบบ"
                      : report.issueType === "performance-issue"
                      ? "ปัญหาด้านประสิทธิภาพ"
                      : report.issueType === "system-outage"
                      ? "ระบบล่ม"
                      : "ไม่ทราบ"}
                  </td>
                  <td
                    className="border border-gray-200 px-4 py-2"
                    style={{
                      wordWrap: "break-word",
                      maxHeight: "5rem",
                      overflow: "auto",
                    }}
                  >
                    {report.description}
                  </td>

                  <td className="border border-gray-200 px-4 py-2 text-center">
                    <select
                      value={report.status || "pending"}
                      onChange={(e) => updateStatus(report._id, e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="pending">รอดำเนินการ</option>
                      <option value="in-progress">กำลังดำเนินการ</option>
                      <option value="resolved">แก้ไขแล้ว</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminReportPage;
