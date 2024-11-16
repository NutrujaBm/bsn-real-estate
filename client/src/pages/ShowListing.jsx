import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { FaEdit, FaTrashAlt, FaEllipsisV } from "react-icons/fa";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserSuccess,
  deleteUserStart,
  deleteUserFailure,
} from "../redux/user/userSlice.js";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

function ShowListings() {
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");

  useEffect(() => {
    if (currentUser) {
      handleShowListings();
    }
  }, [currentUser]);

  const handleActionChange = async (action) => {
    try {
      setStatusFilter(action);
      handleShowListings(action);
    } catch (error) {
      console.log("Error performing action", error);
    }
  };

  const handleShowListings = async (status = statusFilter) => {
    try {
      setShowListingsError(false);
      const res = await fetch(
        `/api/user/listings/${currentUser._id}?status=${status}`
      );
      const data = await res.json();

      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success === false) {
        console.log(error.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  const handleStatusChange = (newStatus) => {
    setStatusFilter(newStatus);
    handleShowListings(newStatus);
    setDropdownOpen(false);
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case "condo":
        return "คอนโด";
      case "apartment":
        return "อพาร์ทเม้นท์";
      default:
        return type;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "active":
        return "กำลังขาย";
      case "closed":
        return "หมดอายุ";
      case "completed":
        return "ดำเนินการเสร็จสิ้น";
      default:
        return status;
    }
  };

  const formatDateToThai = (dateString) => {
    const months = [
      "ม.ค.",
      "ก.พ.",
      "มี.ค.",
      "เม.ย.",
      "พ.ค.",
      "มิ.ย.",
      "ก.ค.",
      "ส.ค.",
      "ก.ย.",
      "ต.ค.",
      "พ.ย.",
      "ธ.ค.",
    ];
    const date = new Date(dateString);
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear() + 543;
    return `${day} ${month} ${year}`;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("th-TH").format(price);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    // Filter listings based on search query
    const filteredListings = userListings.filter((listing) =>
      listing.title.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setUserListings(filteredListings);
  };

  return (
    <main className="max-w-[1700px] mx-auto p-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">
          รายการอสังหาริมทรัพย์ของคุณ
        </h1>
        <p className="text-gray-600 mt-2 mb-5">
          ดูรายการอสังหาริมทรัพย์ของคุณ ที่ลงต้องการให้เช่าในเว็บไซต์ของเรา
        </p>
      </div>

      <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-5 bg-white dark:bg-gray-900 p-8 mb-8">
        <button
          onClick={toggleDropdown}
          className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-lg px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
        >
          <span className="sr-only">Action button</span>
          {getStatusLabel(statusFilter)}
          <svg
            className="w-2.5 h-2.5 ms-2.5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 4 4 4-4"
            />
          </svg>
        </button>
        {dropdownOpen && (
          <div className="z-10 absolute bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
            <ul className="py-1 text-lg text-gray-700 dark:text-gray-200">
              <li>
                <button
                  onClick={() => handleStatusChange("active")}
                  className="block py-2 px-4 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  กำลังขาย
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleStatusChange("closed")}
                  className="block py-2 px-4 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  หมดอายุ
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleStatusChange("completed")}
                  className="block py-2 px-4 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  ดำเนินการเสร็จสิ้น
                </button>
              </li>
            </ul>
          </div>
        )}

        <div className="my-5 text-right">
          {/* Search Input */}
          <label htmlFor="table-search" className="sr-only">
            ค้นหา
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none ">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="text"
              id="table-search-users"
              value={searchQuery}
              onChange={handleSearchChange}
              className="block p-2 ps-10 text-lg text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="ค้นหา..."
            />
          </div>
        </div>
      </div>

      <h1 className="bg-violet-300 border p-5 text-center text-2xl text-white font-semibold rounded-lg shadow-sm mb-5">
        {getStatusLabel(statusFilter)}
      </h1>

      <div className="relative overflow-y-auto shadow-md sm:rounded-lg">
        <table className="w-full text-lg text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-lg text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                อสังหาริมทรัพย์
              </th>
              <th scope="col" className="px-6 py-3">
                ประเภทอสังหาริมทรัพย์
              </th>
              <th scope="col" className="px-6 py-3">
                ราคา (บาท)
              </th>
              <th scope="col" className="px-6 py-3">
                สถานะ
              </th>
              <th scope="col" className="px-6 py-3">
                วันที่ประกาศ
              </th>
              <th scope="col" className="px-6 py-3">
                ปรับปรุงล่าสุด
              </th>
              <th scope="col" className="px-6 py-3">
                จัดการ
              </th>
            </tr>
          </thead>
          <tbody>
            {userListings.length > 0 ? (
              userListings.map((listing) => (
                <tr
                  key={listing._id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <th
                    scope="row"
                    className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <Link to={`/listing/${listing._id}`}>
                      <img
                        src={listing.imageUrls[0]}
                        alt="listing cover"
                        className="h-20 w-30 object-cover rounded-md"
                      />
                    </Link>
                    <Link
                      className="text-slate-700 font-semibold hover:underline truncate flex-1"
                      to={`/listing/${listing._id}`}
                    >
                      <p className="text-lg font-semibold ml-5">
                        {listing.title}
                      </p>
                    </Link>
                  </th>
                  <td className="px-6 py-4 text-lg">
                    {getTypeLabel(listing.type)}
                  </td>
                  <td className="px-6 py-4 text-lg">
                    {formatPrice(listing.price)}
                  </td>

                  <td className="px-6 py-4 text-lg">
                    {getStatusLabel(listing.status)}
                  </td>
                  <td className="px-6 py-4 text-lg">
                    {formatDateToThai(listing.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-lg">
                    {formatDateToThai(listing.updatedAt)}
                  </td>

                  <td className="px-6 py-4 text-lg">
                    <div>
                      <ul className="flex px-1 text-lg text-gray-700 dark:text-gray-200 ">
                        <Link to={`/update-listing/${listing._id}`}>
                          <li className="relative group px-3">
                            <button className="flex items-center justify-center w-10 h-10 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 dark:bg-yellow-700 dark:hover:bg-yellow-600">
                              <FaEdit />
                            </button>
                            <span className="absolute left-1/2 text-center w-22 transform -translate-x-1/2 bottom-12 text-base text-white bg-gray-700 rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              แก้ไขโพสต์
                            </span>
                          </li>
                        </Link>
                        <li className="relative group px-3">
                          <button
                            className="flex items-center justify-center w-10 h-10 bg-red-500 text-white rounded-full hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-600"
                            onClick={() => handleListingDelete(listing._id)}
                          >
                            <FaTrashAlt />
                          </button>
                          <span className="absolute left-1/2 text-center w-18 transform -translate-x-1/2 bottom-12 text-base text-white bg-gray-700 rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            ลบโพสต์
                          </span>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center p-4">
                  ไม่มีพบข้อมูล
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default ShowListings;
