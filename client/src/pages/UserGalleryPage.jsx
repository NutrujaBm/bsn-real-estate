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
  const [listing, setListing] = useState(null);
  const [userListings, setUserListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedIssue, setSelectedIssue] = useState("");
  const [description, setDescription] = useState("");

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

  const handleReportClick = () => {
    setPopupVisible(true);
  };

  const handleClosePopup = () => {
    setPopupVisible(false);
  };

  const goToNextStep = () => {
    if (step === 1 && selectedIssue) {
      setStep(2);
    }
  };

  const goBackToFirstStep = () => {
    setStep(1);
    setDescription(""); // Clear description when going back to step 1
  };

  const handleSubmitReport = () => {
    alert("รายงานของคุณได้ถูกส่งแล้ว");
    // You can add functionality to send data to an API here
    setPopupVisible(false); // Close the popup after submission
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

      {filteredListings.length === 0 && (
        <div className="text-center text-neutral-800 py-5 text-base">
          ไม่พบข้อมูลในหมวดหมู่ "
          {selectedCategory === "ทั้งหมด"
            ? "ทั้งหมด"
            : selectedCategory === "condo"
            ? "คอนโดมิเนียม"
            : "อพาร์ทเม้นท์"}
          "
        </div>
      )}

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
            <p className="text-base mt-1">
              ประเภท :{" "}
              {listing?.type === "condo"
                ? "คอนโดมิเนียม"
                : listing?.type === "apartment"
                ? "อพาร์ทเม้นท์"
                : listing?.type}{" "}
              | {getTimeAgo(listing.updatedAt)}
            </p>
          </div>
        ))}
      </div>

      {/* Popup for additional information */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[540px] relative">
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
              onClick={handleReportClick}
              className="mt-4 flex items-center border p-2 rounded-3xl text-base bg-gray-200 hover:bg-gray-300"
            >
              <CiFlag1 className="mr-3 w-6 h-6" />
              รายงานผู้ใช้
            </button>

            {isPopupVisible && (
              <div className="fixed inset-0 flex justify-center items-center z-20">
                <div className="bg-white p-6 rounded-lg w-96 ">
                  {step === 1 && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
                      <div className="bg-white p-6 rounded-lg w-[400px] h-[500px] relative">
                        <form>
                          <div className="mb-4">
                            <div className="border-y border-black border-opacity-10 py-2">
                              <p className="text-base font-medium">
                                รายงานผู้ใช้
                              </p>
                              <span className="text-base">ปัญหาคืออะไร</span>
                            </div>

                            <div className="flex flex-col mt-6">
                              <label className="flex items-center text-base mb-3">
                                <input
                                  type="radio"
                                  name="report-type"
                                  value="incorrect-info"
                                  className="mr-3 w-5 h-5 border-2 border-gray-400 rounded-full checked:border-blue-500 relative"
                                  onChange={() =>
                                    setSelectedIssue("การแอบอ่างเป็นบุคคลอื่น")
                                  }
                                />
                                การแอบอ่างเป็นบุคคลอื่น
                              </label>
                              <label className="flex items-center text-base mb-3">
                                <input
                                  type="radio"
                                  name="report-type"
                                  value="incorrect-info"
                                  className="mr-3 w-5 h-5 border-2 border-gray-400 rounded-full checked:border-blue-500 relative"
                                  onChange={() =>
                                    setSelectedIssue("มีวาจาสร้างความเกลียดชัง")
                                  }
                                />
                                มีวาจาสร้างความเกลียดชัง
                              </label>
                              <label className="flex items-center text-base mb-3">
                                <input
                                  type="radio"
                                  name="report-type"
                                  value="incorrect-info"
                                  className="mr-3 w-5 h-5 border-2 border-gray-400 rounded-full checked:border-blue-500 relative"
                                  onChange={() =>
                                    setSelectedIssue("สแปมและกลโกง")
                                  }
                                />
                                สแปมและกลโกง
                              </label>
                              <label className="flex items-center text-base mb-3">
                                <input
                                  type="radio"
                                  name="report-type"
                                  value="incorrect-info"
                                  className="mr-3 w-5 h-5 border-2 border-gray-400 rounded-full checked:border-blue-500 relative"
                                  onChange={() =>
                                    setSelectedIssue(
                                      "ไม่มีรายการที่ตรงกับปัญหาของฉัน"
                                    )
                                  }
                                />
                                ไม่มีรายการที่ตรงกับปัญหาของฉัน
                              </label>
                            </div>
                            <div className="absolute bottom-4 right-0 flex justify-between px-4">
                              <button
                                type="button"
                                onClick={() => {
                                  // ตรวจสอบว่าเลือกปัญหาหรือยัง
                                  if (selectedIssue) {
                                    goToNextStep(); // ไปยัง Step ถัดไป
                                  } else {
                                    alert(
                                      "กรุณาเลือกปัญหาก่อนที่จะไปยังขั้นตอนถัดไป"
                                    );
                                  }
                                }}
                                className="px-4 py-2 rounded-full text-base text-blue-500 hover:bg-blue-100"
                              >
                                ถัดไป
                              </button>
                            </div>
                          </div>
                        </form>
                        <button
                          onClick={handleClosePopup} // เรียกปิด Popup
                          className="absolute top-10 right-3 text-gray-700"
                        >
                          <IoIosClose className="w-10 h-10" />
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
                      <div className="bg-white p-6 rounded-lg w-[400px] h-[500px] relative">
                        <div className="border-y border-black border-opacity-10 py-2">
                          <p className="text-base font-medium">รายงานผู้ใช้</p>
                          <span className="text-base">ปัญหาคืออะไร</span>
                        </div>
                        <form>
                          <div className="mb-3 mt-5">
                            <span className="text-base">
                              ปัญหาที่เลือก : {selectedIssue}
                            </span>
                          </div>
                          <div className="mb-5">
                            <span className="text-base">
                              ชื่อผู้ใช้ : {userListings[0]?.userRef?.username}
                            </span>
                          </div>

                          {/* ใส่รายละเอียด */}
                          <div className="mb-4">
                            <textarea
                              className="w-full h-32 border p-2 mb-4 rounded-sm text-base"
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              placeholder="ระบุรายละเอียดเพิ่มเติม"
                            ></textarea>
                          </div>

                          <div className="absolute bottom-4 left-0 right-0 flex justify-between px-4">
                            <button
                              type="button"
                              onClick={goBackToFirstStep}
                              className="px-4 py-2 rounded-full text-base hover:bg-gray-200"
                            >
                              กลับ
                            </button>

                            <button
                              type="button"
                              onClick={handleSubmitReport}
                              className="px-4 py-2 rounded-full text-base text-blue-500 hover:bg-blue-100"
                            >
                              ส่งรายงาน
                            </button>
                          </div>

                          <button
                            onClick={handleClosePopup}
                            className="absolute top-10 right-3 text-gray-700"
                          >
                            <IoIosClose className="w-10 h-10" />
                          </button>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default UserGalleryPage;
