import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const PropertyManagement = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get("/api/listing/all");
        setListings(response.data);
      } catch (error) {
        setError("ไม่สามารถโหลดข้อมูลประกาศได้");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  if (loading) return <div>กำลังโหลด...</div>;
  if (error) return <div>{error}</div>;

  const handleDelete = async (listingId) => {
    const isConfirmed = window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบประกาศนี้?");

    if (!isConfirmed) return;

    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete listing");
      }

      alert("ประกาศถูกลบเรียบร้อยแล้ว กรุณากดรีเฟรส 1 ครั้ง");
      fetchListings();
    } catch (error) {
      console.log("Error deleting listing:", error.message);
      alert("เกิดข้อผิดพลาดในการลบประกาศ: " + error.message);
    }
  };

  const handleEdit = async (listingId, currentStatus) => {
    // เปลี่ยนสถานะเป็น "รอการตรวจสอบ" ถ้าปัจจุบันเป็น "active"
    const newStatus = currentStatus === "active" ? "under review" : "active"; // ใช้ "under review" เป็นสถานะใหม่ที่ต้องการ

    try {
      const response = await axios.put(
        `/api/listing/update/${listingId}`,
        {
          status: newStatus, // ส่งข้อมูลสถานะใหม่
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        alert(`สถานะของประกาศถูกเปลี่ยนเป็น: ${newStatus}`);
        fetchListings(); // รีเฟรชรายการหลังจากอัพเดตสถานะ
      } else {
        alert("ไม่สามารถอัพเดตสถานะได้");
      }
    } catch (error) {
      console.log("Error updating status:", error.message);
      alert("เกิดข้อผิดพลาดในการอัพเดตสถานะ: " + error.message);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-8">
        ภาพรวมประกาศอสังหาริมทรัพย์
      </h2>
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-gray-700">
                ชื่อประกาศ
              </th>
              <th className="px-4 py-2 text-left font-medium text-gray-700">
                ประเภท
              </th>
              <th className="px-4 py-2 text-left font-medium text-gray-700">
                ราคา
              </th>
              <th className="px-4 py-2 text-left font-medium text-gray-700">
                สถานที่
              </th>
              <th className="px-4 py-2 text-left font-medium text-gray-700">
                ขนาด (ตร.ม.)
              </th>
              <th className="px-4 py-2 text-left font-medium text-gray-700">
                ห้องนอน
              </th>
              <th className="px-4 py-2 text-left font-medium text-gray-700">
                ห้องน้ำ
              </th>
              <th className="px-4 py-2 text-left font-medium text-gray-700">
                สถานะ
              </th>
              <th className="px-4 py-2 text-left font-medium text-gray-700">
                วันที่หมดอายุ
              </th>
              <th className="px-4 py-2 text-left font-medium text-gray-700">
                การดำเนินการ
              </th>
            </tr>
          </thead>
          <tbody>
            {listings.length === 0 ? (
              <tr>
                <td
                  colSpan="10"
                  className="px-4 py-2 text-center text-gray-700"
                >
                  ไม่มีประกาศ
                </td>
              </tr>
            ) : (
              listings.map((listing) => (
                <tr key={listing._id} className="border-b border-gray-200">
                  <td className="px-4 py-2">{listing.title}</td>
                  <td className="px-4 py-2">{listing.type}</td>
                  <td className="px-4 py-2">{listing.price} บาท</td>
                  <td className="px-4 py-2">
                    {listing.province}, {listing.district},{" "}
                    {listing.subdistrict}
                  </td>
                  <td className="px-4 py-2">{listing.size}</td>
                  <td className="px-4 py-2">{listing.bedroom}</td>
                  <td className="px-4 py-2">{listing.bathroom}</td>
                  <td className="px-4 py-2">{listing.status}</td>
                  <td className="px-4 py-2">
                    {listing.expiryAt
                      ? new Date(listing.expiryAt).toLocaleDateString()
                      : "ไม่มี"}
                  </td>
                  <td className="px-4 py-2 flex justify-around">
                    <Link
                      to={`/listing/${listing._id}`}
                      className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                    >
                      ดูรายละเอียด
                    </Link>
                    <button
                      onClick={() => handleEdit(listing._id, listing.status)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                      แก้ไข
                    </button>
                    <button
                      onClick={() => handleDelete(listing._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PropertyManagement;
