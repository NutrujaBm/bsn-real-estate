import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
import { LiaSchoolSolid } from "react-icons/lia";
import { TbStairs } from "react-icons/tb";
import { MdContactPhone } from "react-icons/md";
import { HiOutlineBuildingOffice } from "react-icons/hi2";
import Contact from "../components/Contact";
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
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && (
        <p className="text-center my-7 text-2xl">Something went wrong!</p>
      )}

      {listing && !loading && !error && (
        <div className="flex flex-row justify-between">
          {/* Left Section: Image Slider */}
          <div className="w-[60%] h-full px-10 py-10 ">
            <Swiper navigation>
              {listing.imageUrls.map((url) => (
                <SwiperSlide key={url}>
                  <div className="flex justify-center items-center">
                    <div
                      className="h-[550px] w-[100%] mb-5 rounded-3xl border"
                      style={{
                        backgroundImage: `url(${url})`,
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                      }}
                    >
                      {/* Add a loading spinner or placeholder here */}
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="flex justify-between mb-5">
              <h1 className="bg-zinc-100 text-2xl font-bold text-black">
                {listing.title}
              </h1>
              <div className="bg-zinc-100 text-2xl font-bold text-violet-700">
                {listing.price} บาท /{" "}
                {listing.rentalType === "monthly" ? "รายเดือน" : "รายวัน"}
              </div>
            </div>

            <p className="flex items-center mt-5 mb-5 gap-2 text-slate-600 text-base">
              <FaMapMarkerAlt className="text-red-500" />
              {listing.address}, เขต {listing.district}, แขวง{" "}
              {listing.subdistrict}, {listing.province}
            </p>

            <div className="flex mb-5 justify-between">
              <div className="flex mb-1">
                <img
                  className="w-15 h-15 rounded-full border"
                  src={listing.userRef.avatar}
                  alt="User Avatar"
                />{" "}
                <span className="p-3 font-semibold text-lg">
                  {listing.userRef.username}
                </span>
              </div>

              <div className="flex justify-end ">
                {/* Contact Button */}
                {currentUser &&
                  listing.userRef !== currentUser._id &&
                  !contact && (
                    <button
                      onClick={() => setContact(true)}
                      className="z-10 border rounded-2xl w-45 h-12 p-5 mr-3 flex  items-center bg-[#5ece4f] text-white cursor-pointer "
                    >
                      <MdContactPhone className="mr-3" />
                      ข้อมูลติดต่อ
                    </button>
                  )}

                {contact && (
                  <div className="contact-section bg-gray-100 p-5 rounded-lg mt-3">
                    {/* Display contact details */}
                    <h3 className="text-lg font-semibold mb-3">ข้อมูลติดต่อ</h3>
                    <p>
                      <span className="font-bold">
                        โทรศัพท์: {listing.phone}
                      </span>
                    </p>
                    <p>
                      <span className="font-bold">
                        ไอดีไลน์: {listing.lineId}
                      </span>
                    </p>
                    <button
                      onClick={() => setContact(false)}
                      className="mt-3 p-2 bg-red-500 text-white rounded-lg"
                    >
                      ปิด
                    </button>
                  </div>
                )}

                <div className="z-10 border rounded-2xl w-32 h-12 p-3 flex items-center bg-indigo-500 text-white cursor-pointer">
                  <FaShare
                    className="text-white mr-3 ml-4" // changed text color to white
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
                {copied && (
                  <p className="z-10 rounded-md bg-slate-100 p-2 text-base">
                    คัดลอกลิงก์
                  </p>
                )}
              </div>
            </div>

            <div className="p-5 bg-slate-200 rounded-3xl">
              <p className="text-slate-800 border text-base">
                <span>{listing.createdAt}</span>
              </p>

              {/* Description */}
              <p className="text-slate-800 mt-3 border">
                <span className="font-semibold text-black text-base">
                  คำอธิบาย -{" "}
                </span>
                {listing.desc}
              </p>
            </div>
          </div>

          {/* Right Section: Listing Details */}
          <div className="w-[40%] h-full bg-rose-50 px-10 py-10 mt-1 mr-10">
            <div className="flex flex-col max-w-4xl mx-auto gap-4">
              <h2 className="text-xl font-semibold mt-10">ภาพรวม</h2>

              {/* Listing Features */}
              <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-7 text-slate-700 font-normal text-lg mt-5 mb-10">
                <li className="flex items-center gap-1 whitespace-nowrap border border-current px-5 rounded-lg">
                  <IoBedOutline className="text-lg bg-amber-200 w-8 h-8 p-1 rounded-md" />
                  <div className="ml-5">
                    <span>ห้องนอน</span>
                    <p>{listing.bedroom} ห้อง</p>
                  </div>
                </li>

                <li className="flex items-center gap-1 whitespace-nowrap border border-current px-5 rounded-lg">
                  <PiBathtub className="text-lg bg-amber-200 w-7 h-7 p-1 rounded-md" />
                  <div className="ml-5">
                    <span>ห้องน้ำ</span>
                    <p>{listing.bathroom} ห้อง</p>
                  </div>
                </li>

                <li className="flex items-center gap-1 whitespace-nowrap border border-current px-5 rounded-lg">
                  <IoExpandOutline className="text-lg bg-amber-200 w-7 h-7 p-1 rounded-md" />
                  <div className="ml-5">
                    <span>พื้นที่ใช้สอย</span>
                    <p>{listing.size} ตร.ม.</p>
                  </div>
                </li>

                <li className="flex items-center gap-1 whitespace-nowrap border border-current px-5 rounded-lg">
                  <PiDoorOpen className="text-lg bg-amber-200 w-7 h-7 p-1 rounded-md" />
                  <div className="ml-5">
                    <span>เลขที่ห้อง</span>
                    <p>{listing.roomNumber}</p>
                  </div>
                </li>

                <li className="flex items-center gap-1 whitespace-nowrap border border-current px-5 rounded-lg">
                  <HiOutlineBuildingOffice className="text-lg bg-amber-200 w-7 h-7 p-1 rounded-md" />
                  <div className="ml-5">
                    <span>ตึก</span>
                    <p>{listing.building}</p>
                  </div>
                </li>

                <li className="flex items-center gap-1 whitespace-nowrap border border-current px-5 rounded-lg">
                  <TbStairs className="text-lg bg-amber-200 w-7 h-7 p-1 rounded-md" />
                  <div className="ml-5">
                    <span>ชั้น</span>
                    <p>{listing.floor}</p>
                  </div>
                </li>

                <li className="flex items-center gap-1 whitespace-nowrap border border-current px-5 rounded-lg">
                  <LuParkingSquare className="text-lg bg-amber-200 w-7 h-7 p-1 rounded-md" />
                  <div className="ml-5">
                    <span>ที่จอดรถ</span>
                    <p>{listing.parking} คัน</p>
                  </div>
                </li>
              </ul>

              <div className="border"></div>

              <h2 className="text-xl font-semibold mt-10">
                สิ่งอำนวยความสะดวก
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-7 text-slate-700 font-normal text-lg mt-5 mb-10">
                {listing.utilities && listing.utilities.length > 0 ? (
                  listing.utilities.map((utility, index) => (
                    <div key={index} className="utility-item">
                      <IoCheckboxOutline className="w-7 h-7" />
                      <p>{utility}</p>
                    </div>
                  ))
                ) : (
                  <p>ไม่มีข้อมูล</p> // ถ้าไม่มีสิ่งอำนวยความสะดวกแสดงข้อความนี้
                )}
              </div>

              <div className="border"></div>

              <h2 className="text-xl font-semibold mt-10">ที่อยู่</h2>
              <div className="flex flex-col max-w-4xl mx-auto gap-4">
                <div className="mt-5 mb-10 w-full">
                  <MiniMap
                    latitude={listing.latitude}
                    longitude={listing.longitude}
                  />
                </div>
              </div>
              <div className="border"></div>

              <p className="title">สถานที่ใกล้เคียง</p>
              <div className="list-vertical">
                {listing.university && (
                  <div className="feature">
                    <FaUniversity />
                    <span>{listing.university}</span>
                  </div>
                )}
                {listing.school && (
                  <div className="feature">
                    <LiaSchoolSolid />
                    <span>{listing.school}</span>
                  </div>
                )}
                {listing.hospital && (
                  <div className="feature">
                    <PiHospital />
                    <span>{listing.hospital}</span>
                  </div>
                )}
                {listing.mall && (
                  <div className="feature">
                    <IoBagHandleOutline />
                    <span>{listing.mall}</span>
                  </div>
                )}
                {listing.bus && (
                  <div className="feature">
                    <IoBusOutline />
                    <span>{listing.bus}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default PropertyListings;
