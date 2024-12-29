import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaClipboardCheck, FaTrashAlt, FaSync } from "react-icons/fa"; // นำเข้าไอคอน
import { HiMiniArrowsUpDown } from "react-icons/hi2";
import { FaSortUp, FaSortDown } from "react-icons/fa6";
import Swal from "sweetalert2";

const PropertyManagement = () => {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userListings, setUserListings] = useState([]);

  // State สำหรับการจัดเรียงราคา
  const [priceSortOrder, setPriceSortOrder] = useState("asc");
  // State สำหรับการจัดเรียงวันที่
  const [dateSortOrder, setDateSortOrder] = useState("desc");
  // State สำหรับการจัดเรียงวันหมดอายุ
  const [expirySortOrder, setExpirySortOrder] = useState("desc");
  const [alphabeticalOrder, setAlphabeticalOrder] = useState("asc");
  const [sortField, setSortField] = useState("title"); // กำหนดฟิลด์ที่ใช้ในการเรียงลำดับ (title, userRef.username, type, status)

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

  const statusOrder = {
    active: 1,
    completed: 2,
    closed: 3,
  };

  // ฟังก์ชันจัดเรียงตามฟิลด์ที่เลือก
  const sortListings = () => {
    const sortedListings = [...listings].sort((a, b) => {
      const fieldA =
        sortField === "userRef" && a.userRef
          ? a.userRef.username.toString()
          : a[sortField]?.toString(); // ใช้ userRef.username ถ้าฟิลด์เป็น userRef
      const fieldB =
        sortField === "userRef" && b.userRef
          ? b.userRef.username.toString()
          : b[sortField]?.toString(); // ใช้ userRef.username ถ้าฟิลด์เป็น userRef

      if (sortField === "status") {
        // ใช้ statusOrder เพื่อจัดเรียงสถานะ
        const statusA = statusOrder[a.status] || 0;
        const statusB = statusOrder[b.status] || 0;
        return alphabeticalOrder === "asc"
          ? statusA - statusB
          : statusB - statusA;
      }

      if (alphabeticalOrder === "desc") {
        return fieldA.localeCompare(fieldB, ["th", "en"], {
          sensitivity: "accent",
        }); // เรียงจาก ก-ฮ หรือ A-Z
      } else {
        return fieldB.localeCompare(fieldA, ["th", "en"], {
          sensitivity: "accent",
        }); // เรียงจาก ฮ-ก หรือ Z-A
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

  // สลับการจัดเรียงจาก ก-ฮ หรือ A-Z
  const toggleAlphabeticalOrder = (field) => {
    setSortField(field); // เลือกฟิลด์ที่จะใช้ในการเรียง
    setAlphabeticalOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };
  useEffect(() => {
    sortListingsByPrice(); // จัดเรียงราคาเมื่อมีการเปลี่ยนแปลงราคา
  }, [priceSortOrder]);

  useEffect(() => {
    sortListingsByDate(); // จัดเรียงวันที่เมื่อมีการเปลี่ยนแปลงวันที่
  }, [dateSortOrder]);

  useEffect(() => {
    sortListingsByExpiry(); // จัดเรียงวันหมดอายุเมื่อมีการเปลี่ยนแปลงวันหมดอายุ
  }, [expirySortOrder]);

  useEffect(() => {
    sortListings(); // เรียงลำดับเมื่อมีการเปลี่ยนแปลงการตั้งค่า
  }, [alphabeticalOrder, sortField]);

  const handleStatusConfirmation = (listingId) => {
    Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "คุณต้องการเปลี่ยนสถานะจาก 'กำลังปล่อยเช่า' เป็น 'ดำเนินการเสร็จสิ้น' ใช่หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่, เปลี่ยนสถานะ",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        handleStatusChanges(listingId, "completed", "complete"); // ส่ง action เป็น "complete"
      }
    });
  };

  const handleRenewPost = (listingId) => {
    Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "คุณต้องการต่ออายุโพสต์นี้หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่, ต่ออายุโพสต์",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        // หากผู้ใช้กดยืนยัน ต่ออายุโพสต์
        handleStatusChanges(listingId, "active", "renew"); // ส่ง action เป็น "renew"
      }
    });
  };

  const handleStatusChanges = async (listingId, newStatus, action) => {
    try {
      const res = await fetch(`/api/listing/update/${listingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!data.success) {
        console.log("Error updating status");
        return;
      }

      // อัปเดต State ของ userListings
      setUserListings((prevListings) =>
        prevListings.map((listing) =>
          listing._id === listingId
            ? { ...listing, status: newStatus }
            : listing
        )
      );

      // แสดงข้อความแจ้งเตือนตามปุ่มที่กด
      if (action === "renew") {
        Swal.fire(
          "ต่ออายุโพสต์แล้ว!",
          "โพสต์นี้ได้รับการต่ออายุสำเร็จ <br />กรุณารีเฟรช 1 ครั้ง",
          "success"
        );
      } else if (action === "complete") {
        Swal.fire(
          "เปลี่ยนสถานะแล้ว!",
          "สถานะถูกเปลี่ยนเป็น 'ดำเนินการเสร็จสิ้น' สำเร็จ <br />กรุณารีเฟรช 1 ครั้ง",
          "success"
        );
      } else if (action === "delete") {
        Swal.fire(
          "ลบโพสต์แล้ว!",
          "โพสต์นี้ถูกลบออกจากระบบแล้ว <br />กรุณารีเฟรช 1 ครั้ง",
          "success"
        );
      }
    } catch (error) {
      console.log("Error updating status", error);
    }
  };

  const handleListingDelete = async (listingId) => {
    Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "คุณต้องการลบโพสต์นี้หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่, ลบโพสต์",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "ลบโพสต์จริงๆ หรือไม่?",
          text: "การลบโพสต์จะไม่สามารถย้อนกลับได้!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "ใช่, ลบโพสต์",
          cancelButtonText: "ยกเลิก",
        }).then((finalResult) => {
          if (finalResult.isConfirmed) {
            // เรียกฟังก์ชันลบโพสต์
            deleteListing(listingId, "delete");
          }
        });
      }
    });
  };

  const deleteListing = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (res.status !== 200 || data !== "Listing has been deleted!") {
        console.log("Error deleting listing:", data);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
      Swal.fire("ลบโพสต์แล้ว!", "โพสต์ถูกลบสำเร็จ", "success");
    } catch (error) {
      console.log("Error:", error.message);
      Swal.fire("เกิดข้อผิดพลาด!", "ไม่สามารถลบโพสต์ได้", "error");
    }
  };

  if (loading) return <div>กำลังโหลด...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">
        จัดการอสังหาริมทรัพย์ภายในระบบ
      </h1>
      <div
        className="overflow-x-auto"
        style={{ maxHeight: "70vh", overflowY: "auto" }} // Set max height and enable scrolling
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
                <div className="flex items-center justify-between">
                  <span>ชื่อประกาศ</span>
                  <button
                    onClick={() => toggleAlphabeticalOrder("title")}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    {alphabeticalOrder === "asc" ? (
                      <>
                        <FaSortUp />
                        <span className="text-sm">ก-ฮ</span>
                      </>
                    ) : (
                      <>
                        <FaSortDown />
                        <span className="text-sm">ฮ-ก</span>
                      </>
                    )}
                  </button>
                </div>
              </th>
              <th
                className="border border-gray-200 px-4 py-2"
                style={{ width: "180px" }}
              >
                <div className="flex items-center justify-between">
                  <span>ผู้ประกาศ</span>
                  <button
                    onClick={() => toggleAlphabeticalOrder("userRef")}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    {alphabeticalOrder === "asc" ? (
                      <>
                        <FaSortUp />
                        <span className="text-sm">ก-ฮ</span>
                      </>
                    ) : (
                      <>
                        <FaSortDown />
                        <span className="text-sm">ฮ-ก</span>
                      </>
                    )}
                  </button>
                </div>
              </th>
              <th
                className="border border-gray-200 px-4 py-2"
                style={{ width: "140px" }}
              >
                <div className="flex items-center justify-between">
                  <span>ประเภท</span>
                  <button
                    onClick={() => toggleAlphabeticalOrder("type")}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    {alphabeticalOrder === "asc" ? (
                      <>
                        <FaSortUp />
                        <span className="text-sm">ก-ฮ</span>
                      </>
                    ) : (
                      <>
                        <FaSortDown />
                        <span className="text-sm">ฮ-ก</span>
                      </>
                    )}
                  </button>
                </div>
              </th>
              <th
                className="border border-gray-200 px-4 py-2"
                style={{ width: "200px" }}
              >
                <div className="flex items-center justify-between">
                  <span>ราคา (บาท)</span>
                  <button
                    onClick={togglePriceSortOrder}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    {priceSortOrder === "asc" ? (
                      <>
                        <FaSortUp />
                        <span className="text-sm">น้อยไปมาก</span>
                      </>
                    ) : (
                      <>
                        <FaSortDown />
                        <span className="text-sm">มากไปน้อย</span>
                      </>
                    )}
                  </button>
                </div>
              </th>

              <th
                className="border border-gray-200 px-4 py-2"
                style={{ width: "300px" }}
              >
                <div className="flex items-center justify-between">
                  <span>สถานที่</span>
                  <button
                    onClick={() => toggleAlphabeticalOrder("address")}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    {alphabeticalOrder === "asc" ? (
                      <>
                        <FaSortUp />
                        <span className="text-sm">ก-ฮ</span>
                      </>
                    ) : (
                      <>
                        <FaSortDown />
                        <span className="text-sm">ฮ-ก</span>
                      </>
                    )}
                  </button>
                </div>
              </th>

              <th
                className="border border-gray-200 px-4 py-2"
                style={{ width: "165px" }}
              >
                <div className="flex items-center justify-between">
                  <span>สถานะ</span>
                  <button
                    onClick={() => toggleAlphabeticalOrder("status")}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    {alphabeticalOrder === "asc" ? (
                      <>
                        <FaSortUp />
                        <span className="text-sm">ก-ฮ</span>
                      </>
                    ) : (
                      <>
                        <FaSortDown />
                        <span className="text-sm">ฮ-ก</span>
                      </>
                    )}
                  </button>
                </div>
              </th>

              <th
                className="border border-gray-200 px-4 py-2"
                style={{ width: "240px" }}
              >
                <div className="flex items-center justify-between">
                  <span>วันที่ปรับปรุงล่าสุด</span>
                  <button
                    onClick={toggleDateSortOrder}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    {dateSortOrder === "asc" ? (
                      <>
                        <FaSortUp />
                        <span className="text-sm">ใหม่ไปเก่า</span>
                      </>
                    ) : (
                      <>
                        <FaSortDown />
                        <span className="text-sm">เก่าไปใหม่</span>
                      </>
                    )}
                  </button>
                </div>
              </th>

              <th
                className="border border-gray-200 px-4 py-2"
                style={{ width: "210px" }}
              >
                <div className="flex items-center justify-between">
                  <span>วันที่หมดอายุ</span>
                  <button
                    onClick={toggleExpirySortOrder}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    {expirySortOrder === "asc" ? (
                      <>
                        <FaSortUp />
                        <span className="text-sm">ใหม่ไปเก่า</span>
                      </>
                    ) : (
                      <>
                        <FaSortDown />
                        <span className="text-sm">เก่าไปใหม่</span>
                      </>
                    )}
                  </button>
                </div>
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
                      ? "อพาร์ทเม้นท์"
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
                        กำลังปล่อยเช่า
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

                  <td className="px-5 py-5 flex justify-start items-center space-x-6 my-auto">
                    {listing.status === "active" && (
                      <>
                        <div className="group relative">
                          <button
                            className="flex items-center justify-center w-10 h-10 bg-orange-500 text-white rounded-full hover:bg-orange-600 dark:bg-orange-700 dark:hover:bg-orange-600"
                            onClick={() =>
                              handleStatusConfirmation(listing._id)
                            }
                          >
                            <FaClipboardCheck />
                          </button>
                          <span className="absolute left-1/2 text-center w-36 transform -translate-x-1/2 bottom-12 text-base text-white bg-gray-700 bg-opacity-80 rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            ดำเนินการเสร็จสิ้น
                          </span>
                        </div>

                        <div className="group relative">
                          <button
                            className="flex items-center justify-center w-10 h-10 bg-red-500 text-white rounded-full hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-600"
                            onClick={() => handleListingDelete(listing._id)}
                          >
                            <FaTrashAlt />
                          </button>
                          <span className="absolute left-1/2 text-center w-18 transform -translate-x-1/2 bottom-12 text-base text-white bg-gray-700 bg-opacity-80 rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            ลบโพสต์
                          </span>
                        </div>
                      </>
                    )}

                    {listing.status === "completed" && (
                      <div className="group relative">
                        <button
                          className="flex items-center justify-center w-10 h-10 bg-red-500 text-white rounded-full hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-600"
                          onClick={() => handleListingDelete(listing._id)}
                        >
                          <FaTrashAlt />
                        </button>
                        <span className="absolute left-1/2 text-center w-18 transform -translate-x-1/2 bottom-12 text-base text-white bg-gray-700 bg-opacity-80 rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          ลบโพสต์
                        </span>
                      </div>
                    )}

                    {listing.status === "closed" && (
                      <>
                        <div className="group relative">
                          <button
                            className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600"
                            onClick={() => handleRenewPost(listing._id)}
                          >
                            <FaSync />
                          </button>
                          <span className="absolute left-1/2 text-center w-32 transform -translate-x-1/2 bottom-12 text-base text-white bg-gray-700 bg-opacity-80 rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            ต่ออายุโพสต์
                          </span>
                        </div>

                        <div className="group relative">
                          <button
                            className="flex items-center justify-center w-10 h-10 bg-red-500 text-white rounded-full hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-600"
                            onClick={() => handleListingDelete(listing._id)}
                          >
                            <FaTrashAlt />
                          </button>
                          <span className="absolute left-1/2 text-center w-18 transform -translate-x-1/2 bottom-12 text-base text-white bg-gray-700 bg-opacity-80 rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            ลบโพสต์
                          </span>
                        </div>
                      </>
                    )}
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
