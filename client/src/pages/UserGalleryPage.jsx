import { useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";
import { MdOutlineEmail } from "react-icons/md";
import { FaPhoneSquareAlt } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { FaLine } from "react-icons/fa6";
import { CiFlag1 } from "react-icons/ci";
import { formatDistanceToNowStrict } from "date-fns";
import { th } from "date-fns/locale";

function UserGalleryPage() {
  const { userId } = useParams();
  const [userListings, setUserListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // ฟังก์ชันนับคำ
  const countWords = (text) => {
    return text ? text.split(/\s+/).length : 0;
  };

  const userAboutMe = userListings[0]?.userRef?.aboutMe || "";
  const wordCount = countWords(userAboutMe);
  const maxWordCount = 4;

  const getTimeAgo = (updatedAt) => {
    return formatDistanceToNowStrict(new Date(updatedAt), {
      addSuffix: true,
      locale: th,
    });
  };

  useEffect(() => {
    const fetchUserListings = async () => {
      try {
        const res = await fetch(`/api/user/gallery/${userId}`);
        const data = await res.json();
        if (data.success !== false) {
          setUserListings(data);
          setFilteredListings(data); // Set all listings as default
        } else {
          setError("ไม่พบข้อมูลรายการของผู้ใช้");
        }
      } catch (error) {
        setError("เกิดข้อผิดพลาดในการดึงข้อมูล");
      } finally {
        setLoading(false);
      }
    };

    fetchUserListings();
  }, [userId]);

  useEffect(() => {
    if (selectedCategory === "ทั้งหมด") {
      setFilteredListings(userListings);
    } else {
      const filtered = userListings.filter(
        (listing) => listing.type === selectedCategory
      );
      setFilteredListings(filtered);
    }
  }, [selectedCategory, userListings]);

  if (loading) {
    return <div className="text-center text-xl py-10">กำลังโหลด...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">{error}</div>;
  }

  return (
    <div className="p-4 px-73">
      <div className="bg-[url('/banner1.jpg')] bg-cover bg-center h-45 rounded-xl flex flex-col justify-center items-center shadow-lg">
        <h3 className="text-2xl font-semibold text-white px-2 mb-2">
          แกลลอรี่ส่วนตัว
        </h3>
        <h2 className="text-4xl font-bold text-white">
          {userListings[0]?.userRef?.username
            ? `อสังหาริมทรัพย์ของ ${userListings[0]?.userRef?.username}`
            : "อสังหาริมทรัพย์"}
        </h2>
      </div>

      {userListings[0]?.userRef && (
        <div className="flex items-center">
          <img
            src={userListings[0]?.userRef?.avatar}
            alt="User Avatar"
            className="w-40 h-40 rounded-full object-cover mr-4 mt-8"
          />
          <div className="py-5 mt-8">
            <h1 className="text-3xl font-bold mb-2">
              {userListings[0]?.userRef?.username}
            </h1>
            <p className="text-gray-500 text-base">
              {wordCount > maxWordCount
                ? `${userAboutMe
                    .split(" ")
                    .slice(0, maxWordCount)
                    .join(" ")}...`
                : userAboutMe}
              {/* Button to trigger the popup */}
              <button
                onClick={() => setIsPopupOpen(true)}
                className="text-neutral-800 underline ml-2"
              >
                เพิ่มเติม
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex justify-center mt-6 border-b text-base">
        <button
          onClick={() => setSelectedCategory("ทั้งหมด")}
          className={`px-6 py-2 rounded-md text-white mb-5 mr-5 ${
            selectedCategory === "ทั้งหมด" ? "bg-orange-400" : "bg-gray-400"
          }`}
        >
          ทั้งหมด
        </button>
        <button
          onClick={() => setSelectedCategory("condo")}
          className={`px-6 py-2 rounded-md text-white mb-5 mr-5 ${
            selectedCategory === "condo" ? "bg-orange-400" : "bg-gray-400"
          }`}
        >
          คอนโดมิเนียม
        </button>
        <button
          onClick={() => setSelectedCategory("apartment")}
          className={`px-6 py-2 rounded-md text-white mb-5 mr-5 ${
            selectedCategory === "apartment" ? "bg-orange-400" : "bg-gray-400"
          }`}
        >
          อพาร์ทเม้นท์
        </button>
      </div>

      {/* User Listings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-7">
        {filteredListings.map((listing) => (
          <div
            key={listing._id}
            className="rounded-lg transition duration-300 mb-5"
          >
            <Link to={`/listing/${listing._id}`}>
              <img
                src={listing.imageUrls || "/default-image.jpg"}
                alt={listing.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            </Link>
            <Link to={`/listing/${listing._id}`}>
              <h2 className="text-base font-medium text-neutral-900 mb-2">
                {listing.title}
              </h2>
            </Link>
            <p className="mt-2 text-sm text-gray-500">
              ประเภท: {listing.type} | {getTimeAgo(listing.updatedAt)}
            </p>
          </div>
        ))}
      </div>

      {/* Popup for additional information */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[540px] relative">
            {/* Close Button in the top-right corner */}
            <button
              onClick={() => setIsPopupOpen(false)}
              className="absolute top-2 right-2 text-2xl text-gray-700"
            >
              <IoIosClose className="w-10 h-10" />
            </button>
            <h3 className="text-xl font-bold mb-4">เกี่ยวกับ</h3>
            <p className="text-base mb-5">{userAboutMe}</p>
            <h3 className="text-xl font-bold mb-4">รายละเอียดติดต่อ</h3>
            <div className="mb-4">
              {/* แสดงอีเมล */}
              {userListings[0]?.userRef?.email && (
                <p className="flex items-center text-base mb-8">
                  <MdOutlineEmail className="mr-5 text-gray-700 w-6 h-6" />
                  {userListings[0]?.userRef?.email}
                </p>
              )}
              {/* แสดงหมายเลขโทรศัพท์ */}
              {userListings[0]?.userRef?.phone && (
                <p className="flex items-center text-base mb-8">
                  <FaPhoneSquareAlt className="mr-5 text-gray-700 w-6 h-6" />
                  {userListings[0]?.userRef?.phone}
                </p>
              )}
              {/* แสดง Line ID */}
              {userListings[0]?.userRef?.lineId && (
                <p className="flex items-center text-base mb-8">
                  <FaLine className="mr-5 text-gray-700 w-6 h-6" />
                  {userListings[0]?.userRef?.lineId}
                </p>
              )}
            </div>
            <button
              onClick={() => alert("รายงานผู้ใช้งาน")}
              className="mt-4 flex items-center border p-2 rounded-3xl text-base bg-gray-200 hover:bg-gray-300"
            >
              <CiFlag1 className="mr-3" />
              รายงานผู้ใช้งาน
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserGalleryPage;