import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { useSelector } from "react-redux";
import { FaMapMarkerAlt, FaUniversity } from "react-icons/fa";
import { FaShare } from "react-icons/fa6";
import {
  IoBusOutline,
  IoBedOutline,
  IoBagHandleOutline,
  IoCheckboxOutline,
  IoExpandOutline,
} from "react-icons/io5";
import { PiBathtub, PiDoorOpen, PiHospital } from "react-icons/pi";
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

  const { currentUser } = useSelector((state) => state.user);

  console.log(listing);

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
        <div className="flex flex-row justify-between">
          {/* Left Section: Image Slider */}
          <div className="w-[55%] h-full px-5 py-10 ml-20">
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
                      className="h-[550px] w-full mb-5 rounded-xl overflow-hidden border"
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

            <p className="flex items-center mt-5 mb-5 gap-2 text-slate-600 text-base">
              <FaMapMarkerAlt className="text-red-500" />
              {listing.address}, เขต {listing.district}, แขวง{" "}
              {listing.subdistrict}, {listing.province}
            </p>

            <div className="flex mb-5 justify-between items-center">
              <Link to={`/user-gallery/${listing.userRef._id}`}>
                {/* User Info Section */}
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

              {/* Action Buttons Section */}
              <div className="flex items-center space-x-4">
                {/* Contact Button */}
                {currentUser &&
                  listing.userRef !== currentUser._id &&
                  !contact && (
                    <button
                      onClick={() => setContact(true)}
                      className="border rounded-2xl px-6 py-2 flex items-center bg-[#5ece4f] text-white cursor-pointer"
                    >
                      <MdContactPhone className="mr-2" />
                      ข้อมูลติดต่อ
                    </button>
                  )}

                {contact && (
                  <div className="contact-section bg-white p-6 border rounded-lg shadow-lg absolute top-[825px] left-[50%] transform -translate-x-1/2 z-50">
                    {/* Display contact details */}
                    <h3 className="text-xl font-semibold text-center mb-4">
                      ข้อมูลติดต่อ
                    </h3>
                    <div className="flex flex-col space-y-4">
                      <p className="flex items-center space-x-2">
                        <span className="font-bold">โทรศัพท์:</span>
                        <span>{listing.phone}</span>
                      </p>
                      <p className="flex items-center space-x-2">
                        <span className="font-bold">ไอดีไลน์:</span>
                        <span>{listing.lineId}</span>
                      </p>
                    </div>
                    <div className="flex justify-center mt-5">
                      <button
                        onClick={() => setContact(false)}
                        className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-300"
                      >
                        ปิด
                      </button>
                    </div>
                  </div>
                )}

                {/* Share Button */}
                <div className="border rounded-2xl w-32 h-12 px-3 flex items-center bg-indigo-500 text-white cursor-pointer">
                  <FaShare
                    className="mr-3"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      setCopied(true);
                      setTimeout(() => {
                        setCopied(false);
                      }, 2000);
                    }}
                  />
                  แชร์
                </div>

                {/* Copied Message */}
                {copied && (
                  <p className="rounded-md bg-slate-100 p-2 text-sm text-center">
                    คัดลอกลิงก์
                  </p>
                )}
              </div>
            </div>

            <div className="p-5 bg-slate-200 rounded-3xl w-[620px]">
              <p className="text-slate-800 border text-base">
                <span>{listing.createdAt}</span>
              </p>

              {/* Description */}
              <p className="text-slate-800 mt-3 border ">
                <span className="font-semibold text-black text-base">
                  คำอธิบาย -{" "}
                </span>
                {listing.desc}
              </p>
            </div>
          </div>

          {/* Right Section: Listing Details */}
          <div className="w-[35%] h-full py-10 mt-1 mr-25">
            <div className="flex flex-col max-w-4xl mx-auto gap-4">
              <div className="border border-black border-opacity-10 rounded-xl pt-3 pr-4 pb-0 pl-4">
                <h3 className="text-xl font-bold">ภาพรวม</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-7 text-neutral-500 font-normal text-lg pt-5 pb-5">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-7 text-slate-700 font-normal text-lg mt-5 mb-10">
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
                <div className="flex flex-wrap justify-between gap-4 text-base">
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
