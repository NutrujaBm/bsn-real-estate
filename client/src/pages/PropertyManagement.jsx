import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FaSortUp,
  FaSortDown,
  FaClipboardCheck,
  FaTrashAlt,
} from "react-icons/fa"; // นำเข้าไอคอน

const PropertyManagement = () => {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State สำหรับการจัดเรียงราคา
  const [priceSortOrder, setPriceSortOrder] = useState("asc");
  // State สำหรับการจัดเรียงวันที่
  const [dateSortOrder, setDateSortOrder] = useState("desc");
  // State สำหรับการจัดเรียงวันหมดอายุ
  const [expirySortOrder, setExpirySortOrder] = useState("desc");

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get("/api/listing/all");
        console.log(response.data); // ตรวจสอบโครงสร้างข้อมูล
        const sortedListings = response.data.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
        setListings(sortedListings);
        setFilteredListings(sortedListings);
      } catch (error) {
        setError("ไม่สามารถโหลดข้อมูลประกาศได้");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  useEffect(() => {
    sortListingsByPrice(); // จัดเรียงราคาเมื่อมีการเปลี่ยนแปลงราคา
  }, [priceSortOrder]);

  useEffect(() => {
    sortListingsByDate(); // จัดเรียงวันที่เมื่อมีการเปลี่ยนแปลงวันที่
  }, [dateSortOrder]);

  useEffect(() => {
    sortListingsByExpiry(); // จัดเรียงวันหมดอายุเมื่อมีการเปลี่ยนแปลงวันหมดอายุ
  }, [expirySortOrder]);

  // ฟังก์ชันจัดเรียงตามราคา
  const sortListingsByPrice = () => {
    const sortedListings = [...listings].sort((a, b) => {
      if (priceSortOrder === "asc") {
        return a.price - b.price; // เรียงจากน้อยไปมาก
      } else {
        return b.price - a.price; // เรียงจากมากไปน้อย
      }
    });
    setFilteredListings(sortedListings);
  };

  // ฟังก์ชันจัดเรียงตามวันที่
  const sortListingsByDate = () => {
    const sortedListings = [...listings].sort((a, b) => {
      if (dateSortOrder === "desc") {
        return new Date(b.updatedAt) - new Date(a.updatedAt); // เรียงจากใหม่ไปเก่า
      } else {
        return new Date(a.updatedAt) - new Date(b.updatedAt); // เรียงจากเก่าไปใหม่
      }
    });
    setFilteredListings(sortedListings);
  };

  // ฟังก์ชันจัดเรียงวันหมดอายุ
  const sortListingsByExpiry = () => {
    const sortedListings = [...listings].sort((a, b) => {
      if (expirySortOrder === "desc") {
        return new Date(b.expiryAt) - new Date(a.expiryAt); // เรียงจากใหม่ไปเก่า
      } else {
        return new Date(a.expiryAt) - new Date(b.expiryAt); // เรียงจากเก่าไปใหม่
      }
    });
    setFilteredListings(sortedListings);
  };

  // ฟังก์ชันสลับการจัดเรียงราคา
  const togglePriceSortOrder = () => {
    setPriceSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  // ฟังก์ชันสลับการจัดเรียงวันที่
  const toggleDateSortOrder = () => {
    setDateSortOrder((prevOrder) => (prevOrder === "desc" ? "asc" : "desc"));
  };

  // ฟังก์ชันสลับการจัดเรียงวันหมดอายุ
  const toggleExpirySortOrder = () => {
    setExpirySortOrder((prevOrder) => (prevOrder === "desc" ? "asc" : "desc"));
  };

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
      // alert("เกิดข้อผิดพลาดในการลบประกาศ: " + error.message);
    }
  };

  const handleEdit = async (listingId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "under review" : "active";
    try {
      const response = await axios.put(
        `/api/listing/update/${listingId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        alert(`สถานะของประกาศถูกเปลี่ยนเป็น: ${newStatus}`);
        fetchListings();
      } else {
        alert("ไม่สามารถอัพเดตสถานะได้");
      }
    } catch (error) {
      console.log("Error updating status:", error.message);
      alert("เกิดข้อผิดพลาดในการอัพเดตสถานะ: " + error.message);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">
        ภาพรวมประกาศอสังหาริมทรัพย์
      </h1>
      <div
        className="overflow-x-auto"
        style={{ maxHeight: "80vh", overflowY: "auto" }} // Set max height and enable scrolling
      >
        <table
          className="w-full border-collapse border border-gray-200 text-base"
          style={{ tableLayout: "fixed" }}
        >
          <thead className="bg-gray-100 text-center">
            <tr>
              <th
                className="border border-gray-200 px-4 py-2"
                style={{ width: "200px" }}
              >
                ชื่อประกาศ
              </th>
              <th
                className="border border-gray-200 px-4 py-2 "
                style={{ width: "150px" }}
              >
                ผู้ประกาศ
              </th>
              <th
                className="border border-gray-200 px-4 py-2 "
                style={{ width: "130px" }}
              >
                ประเภท
              </th>
              <th
                className="border border-gray-200 px-4 py-2 "
                style={{ width: "140px" }}
              >
                ราคา (บาท)
                <button
                  onClick={togglePriceSortOrder}
                  className="ml-2 text-blue-500 hover:text-blue-700"
                >
                  {priceSortOrder === "asc" ? (
                    <FaSortUp /> // ถ้าเป็นการจัดเรียงจากน้อยไปมาก ให้แสดงไอคอน FaSortUp
                  ) : (
                    <FaSortDown /> // ถ้าเป็นการจัดเรียงจากมากไปน้อย ให้แสดงไอคอน FaSortDown
                  )}
                </button>
              </th>
              <th
                className="border border-gray-200 px-4 py-2 "
                style={{ width: "300px" }}
              >
                สถานที่
              </th>

              <th
                className="border border-gray-200 px-4 py-2"
                style={{ width: "165px" }}
              >
                สถานะ
              </th>
              <th
                className="border border-gray-200 px-4 py-2 "
                style={{ width: "180px" }}
              >
                วันที่ปรับปรุงล่าสุด
                <button
                  onClick={toggleDateSortOrder}
                  className="ml-2 text-blue-500 hover:text-blue-700"
                >
                  {dateSortOrder === "desc" ? <FaSortUp /> : <FaSortDown />}
                </button>
              </th>
              <th
                className="border border-gray-200 px-4 py-2 text-center"
                style={{ width: "150px" }}
              >
                วันที่หมดอายุ
                <button
                  onClick={toggleExpirySortOrder}
                  className="ml-2 text-blue-500 hover:text-blue-700"
                >
                  {expirySortOrder === "desc" ? <FaSortUp /> : <FaSortDown />}
                </button>
              </th>
              <th
                className="border border-gray-200 px-4 py-2 text-center"
                style={{ width: "150px" }}
              >
                การดำเนินการ
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredListings.length === 0 ? (
              <tr>
                <td
                  colSpan="10"
                  className="border border-gray-200 px-4 py-2 text-center"
                >
                  ไม่มีประกาศ
                </td>
              </tr>
            ) : (
              filteredListings.map((listing) => (
                <tr
                  key={listing._id}
                  className="border border-gray-200 px-4 py-2"
                >
                  <td className="border border-gray-200 px-4 py-2">
                    <Link
                      to={`/listing/${listing._id}`}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      {listing.title}
                    </Link>
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {listing.userRef && listing.userRef.username ? (
                      <Link
                        to={`/user-gallery/${listing.userRef._id}`}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        {listing.userRef.username}
                      </Link>
                    ) : (
                      "-"
                    )}
                  </td>

                  <td className="border border-gray-200 px-4 py-2 text-center">
                    {listing.type === "condo"
                      ? "คอนโด"
                      : listing.type === "apartment"
                      ? "อพาร์ทเมนต์"
                      : listing.type}
                  </td>

                  <td className="border border-gray-200 px-4 py-2 text-right">
                    {listing.price.toLocaleString()}
                  </td>

                  <td className="border border-gray-200 px-4 py-2 text-left">
                    {listing.address}, {listing.district}, {listing.subdistrict}
                    , {listing.province}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-center">
                    {listing.status === "active" && (
                      <span className="text-green-700 bg-green-200 px-2 py-1 rounded-full">
                        กำลังขาย
                      </span>
                    )}
                    {listing.status === "completed" && (
                      <span className="text-blue-500 bg-blue-200 px-2 py-1 rounded-full">
                        ดำเนินการเสร็จสิ้น
                      </span>
                    )}
                    {listing.status === "closed" && (
                      <span className="text-red-500 bg-red-200 px-2 py-1 rounded-full">
                        หมดอายุ
                      </span>
                    )}
                  </td>

                  <td className="border border-gray-200 px-4 py-2 text-center">
                    {listing.updatedAt
                      ? new Date(listing.updatedAt).toLocaleDateString(
                          "th-TH",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : "ไม่มี"}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-center">
                    {listing.expiryAt
                      ? new Date(listing.expiryAt).toLocaleDateString("th-TH", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "ไม่มี"}
                  </td>

                  <td className="px-4 py-2 flex justify-center space-x-4 my-auto">
                    <div className="group relative">
                      <button
                        className="flex items-center justify-center w-10 h-10 bg-orange-500 text-white rounded-full hover:bg-orange-600 dark:bg-orange-700 dark:hover:bg-orange-600"
                        onClick={() =>
                          handleStatusChanges(listing._id, "completed")
                        }
                      >
                        <FaClipboardCheck />
                      </button>
                      <span className="absolute left-1/2 text-center w-32 transform -translate-x-1/2 bottom-12 text-base text-white bg-gray-700 bg-opacity-80 rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        เปลี่ยนสถานะ
                      </span>
                    </div>

                    <div className="group relative">
                      <button
                        className="flex items-center justify-center w-10 h-10 bg-red-500 text-white rounded-full hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-600"
                        onClick={() => handleDelete(listing._id)}
                      >
                        <FaTrashAlt />
                      </button>
                      <span className="absolute left-1/2 text-center w-18 transform -translate-x-1/2 bottom-12 text-base text-white bg-gray-700 bg-opacity-80 rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        ลบโพสต์
                      </span>
                    </div>
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
