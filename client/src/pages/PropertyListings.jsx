import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { useSelector } from "react-redux";
import { FaMapMarkerAlt, FaUniversity } from "react-icons/fa";
import { CiFlag1 } from "react-icons/ci";
import {
  IoBusOutline,
  IoBedOutline,
  IoBagHandleOutline,
  IoCheckboxOutline,
  IoExpandOutline,
} from "react-icons/io5";
import { IoIosClose } from "react-icons/io";
import {
  PiBathtub,
  PiDoorOpen,
  PiHospital,
  PiShareFatLight,
} from "react-icons/pi";
import { LuParkingSquare } from "react-icons/lu";
import { LiaSchoolSolid, LiaUniversitySolid } from "react-icons/lia";
import { TbStairs } from "react-icons/tb";
import { MdContactPhone } from "react-icons/md";
import { HiOutlineBuildingOffice } from "react-icons/hi2";
import MiniMap from "../components/MiniMap";

function PropertyListings() {
  SwiperCore.use([Navigation]);

  const params = useParams();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedIssue, setSelectedIssue] = useState("");
  const [description, setDescription] = useState("");

  const { currentUser } = useSelector((state) => state.user);

  const descriptionText = listing?.desc || "";
  const isLongDescription = descriptionText.split("\n").length > 3;

  const truncatedDescription = isLongDescription
    ? descriptionText.split("\n").slice(0, 1).join("\n") + "..."
    : descriptionText;

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };
  const handleReportClick = () => {
    setPopupVisible(true);
    document.body.classList.add("popup-open");
  };

  const handleClosePopup = () => {
    setPopupVisible(false);
    document.body.classList.remove("popup-open");
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
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }

        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.listingId]);

  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl">กำลังโหลด...</p>}
      {error && (
        <p className="text-center my-7 text-2xl">เกิดข้อผิดพลาดบางอย่าง!</p>
      )}

      {listing && !loading && !error && (
        <div className="flex flex-col lg:flex-row justify-between px-4 lg:px-20 py-10">
          <div className="w-full lg:w-[60%] h-full mb-10 lg:mb-0 mt-1 xl:ml-5 2xl:ml-10 2xl:mr-5">
            <Swiper
              navigation={{
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              }}
            >
              {listing.imageUrls.map((url) => (
                <SwiperSlide key={url}>
                  <div className="flex justify-center items-center">
                    <div
                      className="h-[350px] md:h-[400px] lg:h-[550px] w-full mb-5 rounded-xl overflow-hidden border"
                      style={{
                        backgroundImage: `url(${url})`,
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                      }}
                    ></div>
                  </div>
                </SwiperSlide>
              ))}
              <div className="swiper-button-next flex items-center justify-center bg-white text-black rounded-full w-10 h-10 hover:bg-gray-200 hover:text-black transition shadow-[0_4px_10px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_15px_rgba(0,0,0,0.2)]"></div>
              <div className="swiper-button-prev flex items-center justify-center bg-white text-black rounded-full w-10 h-10 hover:bg-gray-200 hover:text-black transition shadow-[0_4px_10px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_15px_rgba(0,0,0,0.2)]"></div>
            </Swiper>

            <div className="flex justify-between mb-5">
              <h1 className="bg-zinc-100 text-2xl font-bold text-neutral-800">
                {listing.title}
              </h1>
              <div className="bg-zinc-100 text-2xl font-bold text-violet-600">
                {new Intl.NumberFormat("th-TH").format(listing.price)} บาท /{" "}
                {listing.rentalType === "monthly" ? "รายเดือน" : "รายวัน"}
              </div>
            </div>

            <p className="flex items-center mt-5 mb-5 gap-2 text-slate-600 text-sm sm:text-base ">
              <FaMapMarkerAlt className="text-red-500" />
              {listing.address}, เขต {listing.district}, แขวง{" "}
              {listing.subdistrict}, {listing.province}
            </p>

            <div className="flex mb-5 justify-between items-center">
              <Link to={`/user-gallery/${listing.userRef._id}`}>
                <div className="flex items-center">
                  <img
                    className="w-12 h-12 rounded-full border"
                    src={listing.userRef.avatar}
                    alt="User Avatar"
                  />
                  <span className="ml-3 text-lg font-semibold text-neutral-900">
                    {listing.userRef.username}
                  </span>
                </div>
              </Link>

              <div className="flex items-center space-x-4">
                <div
                  className="border rounded-full w-25 h-12 px-3 flex items-center text-base bg-gray-200 hover:bg-gray-300 cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    setCopied(true);
                    setTimeout(() => {
                      setCopied(false);
                    }, 2000);
                  }}
                >
                  <PiShareFatLight className="ml-2 mr-1 w-6 h-6" />
                  แชร์
                </div>

                {copied && (
                  <div className="absolute bottom-14 left-[920px] transform -translate-x-1/2 bg-slate-100 p-2 text-sm text-center rounded-md shadow-md z-10">
                    คัดลอกลิงก์
                  </div>
                )}
                <button
                  onClick={handleReportClick}
                  className="flex items-center border p-2 rounded-3xl text-base bg-gray-200 hover:bg-gray-300"
                  title="รายงาน"
                >
                  <CiFlag1 className="mr-0 sm:mr-3 w-6 h-6" />
                  <span className="hidden sm:inline">รายงาน</span>
                </button>

                {isPopupVisible && (
                  <div className="fixed inset-0 flex justify-center items-center z-20 ">
                    <div className="bg-white p-6 rounded-lg w-96 ">
                      {step === 1 && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20 ">
                          <div className="bg-white p-6 rounded-lg w-[400px] h-[500px] relative ">
                            <form>
                              <div className="mb-4">
                                <div className="border-y border-black border-opacity-10 py-2">
                                  <p className="text-base font-medium">
                                    รายงานโพสต์
                                  </p>
                                  <span className="text-base">
                                    ปัญหาคืออะไร
                                  </span>
                                </div>

                                <div className="flex flex-col mt-6">
                                  <label className="flex items-center text-base mb-3">
                                    <input
                                      type="radio"
                                      name="report-type"
                                      value="incorrect-info"
                                      className="mr-3 w-5 h-5 border-2 border-gray-400 rounded-full checked:border-blue-500 relative"
                                      onChange={() =>
                                        setSelectedIssue(
                                          "การให้ข้อมูลที่ไม่ถูกต้อง"
                                        )
                                      }
                                    />
                                    การให้ข้อมูลที่ไม่ถูกต้อง
                                  </label>
                                  <label className="flex items-center text-base mb-3">
                                    <input
                                      type="radio"
                                      name="report-type"
                                      value="incorrect-info"
                                      className="mr-3 w-5 h-5 border-2 border-gray-400 rounded-full checked:border-blue-500 relative"
                                      onChange={() =>
                                        setSelectedIssue("รูปภาพที่ไม่สอดคล้อง")
                                      }
                                    />
                                    รูปภาพที่ไม่สอดคล้อง
                                  </label>
                                  <label className="flex items-center text-base mb-3">
                                    <input
                                      type="radio"
                                      name="report-type"
                                      value="incorrect-info"
                                      className="mr-3 w-5 h-5 border-2 border-gray-400 rounded-full checked:border-blue-500 relative"
                                      onChange={() =>
                                        setSelectedIssue(
                                          "เนื้อหาขาดหายไปไม่ครบถ้วน"
                                        )
                                      }
                                    />
                                    เนื้อหาขาดหายไปไม่ครบถ้วน
                                  </label>
                                  <label className="flex items-center text-base mb-3">
                                    <input
                                      type="radio"
                                      name="report-type"
                                      value="incorrect-info"
                                      className="mr-3 w-5 h-5 border-2 border-gray-400 rounded-full checked:border-blue-500 relative"
                                      onChange={() =>
                                        setSelectedIssue("การโพสต์หลอกลวง")
                                      }
                                    />
                                    การโพสต์หลอกลวง
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
                              <p className="text-base font-medium">
                                รายงานโพสต์
                              </p>
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
                                  ชื่อโพสต์ : {listing.title}
                                </span>
                              </div>

                              {/* ใส่รายละเอียด */}
                              <div className="mb-4">
                                <textarea
                                  className="w-full h-32 border p-2 mb-4 rounded-sm text-base"
                                  value={description}
                                  onChange={(e) =>
                                    setDescription(e.target.value)
                                  }
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

            <div className="p-5 bg-gray-200 rounded-xl w-full">
              <p className="text-slate-800 text-base mb-5">
                <span>
                  {new Date(listing?.updatedAt).toLocaleDateString("th-TH", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span className="text-base ml-3">
                  ประเภทอสังหาริมทรัพย์ :{" "}
                  {listing?.type === "condo"
                    ? "คอนโดมิเนียม"
                    : listing?.type === "apartment"
                    ? "อพาร์ทเม้นท์"
                    : listing?.type}
                </span>
              </p>

              <p className="text-slate-800 mt-3 text-base">
                {showFullDescription ? descriptionText : truncatedDescription}
                {isLongDescription && !showFullDescription && (
                  <button
                    onClick={toggleDescription}
                    className="text-neutral-950"
                  >
                    เพิ่มเติม
                  </button>
                )}
                {showFullDescription && (
                  <button
                    onClick={toggleDescription}
                    className="flex text-neutral-950 mt-5"
                  >
                    แสดงน้อยลง
                  </button>
                )}
              </p>
            </div>
          </div>

          {/* Right Section: Listing Details */}
          <div className="w-full lg:w-[35%] h-full py-10 mt-[-60px] md:mt-[-50px] lg:mt-[-35px] xl:mr-6 2xl:mr-15">
            <div className="flex flex-col max-w-4xl mx-auto gap-4">
              <div className="border border-black border-opacity-10 rounded-xl pt-3 pr-4 pb-0 pl-4">
                <h3 className="text-xl font-bold">ภาพรวม</h3>
                <ul className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-2 2xl:grid-cols-3 gap-7 text-neutral-500 font-normal text-lg pt-5 pb-5">
                  <li className="flex items-center gap-1 whitespace-nowrap border border-current px-5 rounded-lg p-1">
                    <IoBedOutline className="text-lg bg-amber-200 w-7 h-7 p-1 rounded-md text-neutral-700" />
                    <div className="ml-5 text-neutral-800 text-base">
                      <span>ห้องนอน</span>
                      <p>
                        {listing.bedroom === 0
                          ? "ห้องสตูดิโอ"
                          : `${listing.bedroom} ห้อง`}
                      </p>
                    </div>
                  </li>

                  <li className="flex items-center gap-1 whitespace-nowrap border border-current px-5 rounded-lg p-1">
                    <PiBathtub className="text-lg bg-amber-200 w-7 h-7 p-1 rounded-md text-neutral-700" />
                    <div className="ml-5 text-neutral-800 text-base">
                      <span>ห้องน้ำ</span>
                      <p>{listing.bathroom} ห้อง</p>
                    </div>
                  </li>

                  <li className="flex items-center gap-1 whitespace-nowrap border border-current px-5 rounded-lg p-1">
                    <IoExpandOutline className="text-lg bg-amber-200 w-7 h-7 p-1 rounded-md text-neutral-700" />
                    <div className="ml-5 text-neutral-800 text-base">
                      <span>พื้นที่ใช้สอย</span>
                      <p>{listing.size} ตร.ม.</p>
                    </div>
                  </li>

                  <li className="flex items-center gap-1 whitespace-nowrap border border-current px-5 rounded-lg p-1">
                    <PiDoorOpen className="text-lg bg-amber-200 w-7 h-7 p-1 rounded-md text-neutral-700" />
                    <div className="ml-5 text-neutral-800 text-base">
                      <span>เลขที่ห้อง</span>
                      <p>{listing.roomNumber}</p>
                    </div>
                  </li>

                  <li className="flex items-center gap-1 whitespace-nowrap border border-current px-5 rounded-lg p-1">
                    <HiOutlineBuildingOffice className="text-lg bg-amber-200 w-7 h-7 p-1 rounded-md text-neutral-700" />
                    <div className="ml-5 text-neutral-800 text-base">
                      <span>ตึก</span>
                      <p>{listing.building}</p>
                    </div>
                  </li>

                  <li className="flex items-center gap-1 whitespace-nowrap border border-current px-5 rounded-lg p-1">
                    <TbStairs className="text-lg bg-amber-200 w-7 h-7 p-1 rounded-md text-neutral-700" />
                    <div className="ml-5 text-neutral-800 text-base">
                      <span>ชั้น</span>
                      <p>{listing.floor}</p>
                    </div>
                  </li>

                  <li className="flex items-center gap-1 whitespace-nowrap border border-current px-5 rounded-lg p-1">
                    <LuParkingSquare className="text-lg bg-amber-200 w-7 h-7 p-1 rounded-md text-neutral-700" />
                    <div className="ml-5 text-neutral-800 text-base">
                      <span>ที่จอดรถ</span>
                      <p>{listing.parking} คัน</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="border-b border-black border-opacity-10">
                <h2 className="text-xl font-bold mt-5 mb-5">
                  สิ่งอำนวยความสะดวก
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-4 gap-7 text-slate-700 font-normal text-lg mt-5 mb-10">
                  {listing.utilities && listing.utilities.length > 0 ? (
                    listing.utilities.map((utility, index) => (
                      <div key={index} className="utility-item flex">
                        <IoCheckboxOutline className="w-6 h-6 text-neutral-700" />
                        <p className="ml-2 text-base">{utility}</p>
                      </div>
                    ))
                  ) : (
                    <div className="flex justify-center items-center w-full">
                      <p className="text-base text-gray-500">
                        ไม่มีข้อมูลสิ่งอำนวยความสะดวก
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-b border-black border-opacity-10">
                <h2 className="text-xl font-bold mt-5 mb-5">ตำแหน่งบนแผนที่</h2>
                <div className="flex flex-col max-w-4xl mx-auto gap-4">
                  <div className="mt-5 mb-5 w-full">
                    <MiniMap
                      latitude={listing.latitude}
                      longitude={listing.longitude}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold mt-5 mb-5">
                  สถานที่ใกล้เคียง
                </h2>
                <div className="flex flex-wrap flex-col justify-start gap-4 text-base">
                  {listing.university ||
                  listing.school ||
                  listing.hospital ||
                  listing.mall ||
                  listing.bus ? (
                    <>
                      {listing.university && (
                        <div className="feature flex items-center space-x-2 pl-2 pr-2 border-l-2 border-amber-300 flex-[calc(50%-8px)]">
                          <LiaUniversitySolid className="text-lg bg-amber-200 w-7 h-7 p-1  rounded-md text-neutral-700" />
                          <span>{listing.university}</span>
                        </div>
                      )}
                      {listing.school && (
                        <div className="feature flex items-center space-x-2 pl-2 pr-2 border-l-2 border-amber-300 flex-[calc(50%-8px)]">
                          <LiaSchoolSolid className="text-lg bg-amber-200 w-7 h-7 p-1 rounded-md text-neutral-700" />
                          <span>{listing.school}</span>
                        </div>
                      )}
                      {listing.hospital && (
                        <div className="feature flex items-center space-x-2 pl-2 pr-2 border-l-2 border-amber-300 flex-[calc(50%-8px)]">
                          <PiHospital className="text-lg bg-amber-200 w-7 h-7 p-1 rounded-md text-neutral-700" />
                          <span>{listing.hospital}</span>
                        </div>
                      )}
                      {listing.mall && (
                        <div className="feature flex items-center space-x-2 pl-2 pr-2 border-l-2 border-amber-300 flex-[calc(50%-8px)]">
                          <IoBagHandleOutline className="text-lg bg-amber-200 w-7 h-7 p-1 rounded-md text-neutral-700" />
                          <span>{listing.mall}</span>
                        </div>
                      )}
                      {listing.bus && (
                        <div className="feature flex items-center space-x-2 pl-2 pr-2 border-l-2 border-amber-300 flex-[calc(50%-8px)]">
                          <IoBusOutline className="text-lg bg-amber-200 w-7 h-7 p-1 rounded-md text-neutral-700" />
                          <span>{listing.bus}</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center w-full text-gray-500">
                      ไม่มีข้อมูลสถานที่ใกล้เคียง
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default PropertyListings;
