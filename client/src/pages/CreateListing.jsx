import React, { useEffect, useState } from "react";
import { FaCamera, FaLine, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import GoogleMapSection from "../components/GoogleMapSection";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { provincesData } from "../lib/provincesData.js";

function CreateListing() {
  const [files, setFiles] = useState([]);
  console.log(files);
  const [formData, setFormData] = useState({
    title: "",
    type: "condo",
    price: 0,
    rentalType: "monthly",
    address: "",
    province: "",
    district: "",
    subdistrict: "",
    latitude: 0,
    longitude: 0,
    bedroom: "0",
    bathroom: "1",
    size: 0,
    roomNumber: "",
    building: "",
    floor: "",
    parking: "0",
    utilities: [],
    customUtility: "",
    university: "",
    hospital: "",
    mall: "",
    school: "",
    bus: "",
    imageUrls: [],
    expiryDate: "",
    status: "active",
    phone: "",
    lineId: "",
    likes: 0,
  });

  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  console.log(formData);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [districts, setDistricts] = useState([]);
  const [subdistricts, setSubdistricts] = useState([]);

  const handleProvinceChange = (event) => {
    const provinceName = event.target.value;
    setSelectedProvince(provinceName);
    const province = provincesData.find((p) => p.name === provinceName);
    setDistricts(province ? province.districts : []);
    setSubdistricts([]);
    setSelectedDistrict("");
    setFormData({
      ...formData,
      province: provinceName,
    });
  };

  const handleDistrictChange = (event) => {
    const districtName = event.target.value;
    setSelectedDistrict(districtName);
    const district = districts.find((d) => d.name === districtName);
    setSubdistricts(district ? district.subdistricts : []);
    setFormData({
      ...formData,
      district: districtName,
    });
  };

  const handleLocationSelect = (location) => {
    setFormData({
      ...formData,
      latitude: location.lat,
      longitude: location.lng,
    });
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length <= 4) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch(() => {
          setImageUploadError("อัปโหลดรูปภาพล้มเหลว (ขนาดสูงสุด 2 MB ต่อรูป)");
          setUploading(false);
        });
    } else {
      setImageUploadError("คุณสามารถอัปโหลดรูปภาพได้สูงสุด 4 รูปต่อรายการ");
      setUploading(false);
    }
  };

  useEffect(() => {
    if (files.length > 0) {
      handleImageSubmit();
    }
  }, [files]);

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // ถ้าฟิลด์ไม่ใช่ checkbox หรือ customUtility, อัพเดต formData ปกติ
    if (type !== "checkbox" && name !== "customUtility") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }

    // ถ้าเป็น checkbox: อัพเดต array ของ utilities
    if (type === "checkbox") {
      setFormData((prevData) => {
        const updatedUtilities = checked
          ? [...prevData.utilities, value] // ถ้าคลิกเลือกให้เพิ่มค่าลงใน array
          : prevData.utilities.filter((item) => item !== value); // ถ้ายกเลิกเลือกให้ลบค่าจาก array

        return {
          ...prevData,
          utilities: updatedUtilities,
        };
      });
    }

    // ถ้าเป็น customUtility: อัพเดต customUtility
    if (name === "customUtility") {
      setFormData((prevData) => ({
        ...prevData,
        customUtility: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError("คุณต้องอัปโหลดรูปภาพอย่างน้อยหนึ่งรูป");

      setLoading(true);
      setError(false);

      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });

      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
        return;
      }

      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError("เกิดข้อผิดพลาด: " + error.message);
      setLoading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">
          สร้างโพสต์อสังหาริมทรัพย์ของคุณ
        </h1>
        <p className="text-gray-600 mt-2 mb-15">
          เริ่มต้นโปรโมทอสังหาริมทรัพย์ของคุณง่ายๆ
          ให้ผู้สนใจเข้าถึงได้ในไม่กี่คลิก
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="space-y-12">
          {/* Property Title */}
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-xl/7 font-semibold text-gray-900">
              หัวข้ออสังหาริมทรัพย์
            </h2>
            <p className="mt-1 text-base/6 text-gray-600">
              This information will be displayed publicly so be careful what you
              share.
            </p>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label
                  htmlFor="title"
                  className="block text-lg font-medium text-gray-900"
                >
                  หัวข้อ
                </label>
                <div className="mt-2">
                  <input
                    className="bg-gray-50 border rounded-lg border-gray-300 text-gray-900 text-lg focus:ring-blue-500 focus:border-blue-500 block p-3.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full"
                    id="title"
                    name="title"
                    type="text"
                    placeholder="สร้างหัวข้อที่น่าสนใจ"
                    onChange={handleChange}
                    value={formData.title}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="col-span-full">
              <label
                htmlFor="desc"
                className="block text-lg/6 font-medium text-gray-900"
              >
                รายละเอียด
              </label>
              <div className="mt-2">
                <textarea
                  className="bg-gray-50 border rounded-lg border-gray-300 text-gray-900 text-lg focus:ring-blue-500 focus:border-blue-500 block p-3.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full"
                  id="desc"
                  name="desc"
                  placeholder="บรรยายรายละเอียดที่เกี่ยวกับอสังหาริมทรัพย์ของคุณ เพื่อเพิ่มความน่าสนใจ"
                  rows={3}
                  defaultValue={""}
                  onChange={handleChange}
                  value={formData.desc}
                  required
                />
              </div>
              <p className="mt-3 text-base/6 text-gray-600">
                Write a few sentences about the property.
              </p>
            </div>

            {/* Property Type */}
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="type"
                  className="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
                >
                  ประเภทอสังหาริมทรัพย์
                </label>
                <select
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  id="type"
                  name="type"
                  onChange={handleChange}
                  value={formData.type}
                  required
                >
                  <option value="condo">คอนโด</option>
                  <option value="apartment">อพาร์ทเมนต์</option>
                </select>
              </div>

              {/* Rent Price and Type */}
              <div className="flex">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="price"
                    className="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
                  >
                    ราคาเช่า (บาท)
                  </label>
                  <input
                    className="bg-gray-50 border rounded-s-lg border-gray-300 text-gray-900 text-lg focus:ring-blue-500 focus:border-blue-500 block p-3.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-60"
                    id="price"
                    name="price"
                    type="number"
                    placeholder="ราคา"
                    min="0"
                    max="10000000"
                    onChange={handleChange}
                    value={formData.price}
                    required
                  />
                </div>
                <div className="sm:col-span-3">
                  <select
                    className="bg-gray-50 border rounded-e-lg border-gray-300 text-gray-900 text-lg focus:ring-blue-500 focus:border-blue-500 block p-3.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-40 mt-9"
                    id="rentalType"
                    name="rentalType"
                    onChange={handleChange}
                    value={formData.rentalType}
                    required
                  >
                    <option value="monthly">รายเดือน</option>
                    <option value="daily">รายวัน</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-xl/7 font-semibold text-gray-900">
              ที่อยู่อสังหาริมทรัพย์
            </h2>
            <p className="mt-1 text-base/6 text-gray-600">
              Use a permanent address where you can receive mail.
            </p>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="col-span-full">
                <label
                  htmlFor="address"
                  className="block text-lg/6 font-medium text-gray-900"
                >
                  ที่อยู่
                </label>
                <div className="mt-2">
                  <textarea
                    className="bg-gray-50 border rounded-lg border-gray-300 text-gray-900 text-lg focus:ring-blue-500 focus:border-blue-500 block p-3.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full"
                    id="address"
                    name="address"
                    placeholder="พิมพ์ที่อยู่ของอสังหาริมทรัพย์"
                    rows={3}
                    onChange={handleChange}
                    value={formData.address}
                    required
                  />
                </div>
                <p className="mt-3 text-base/6 text-gray-600">
                  กรุณาใส่ที่อยู่ที่เป็นจริง หากมีผู้รายงานว่า "ที่อยู่ไม่จริง"
                  ประกาศของท่านจะถูกนำออกจากระบบทันที เพื่อรอการตรวจสอบ
                </p>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-2 sm:col-start-1">
                <label
                  htmlFor="province"
                  className="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
                >
                  จังหวัด
                </label>
                <select
                  className="bg-gray-50 border text-lg rounded-lg w-full p-3.5 dark:bg-gray-700"
                  id="province"
                  name="province"
                  onChange={handleProvinceChange}
                  value={formData.province}
                  required
                >
                  <option value="" disabled>
                    --เลือกจังหวัด--
                  </option>
                  {provincesData.map((province) => (
                    <option key={province.name} value={province.name}>
                      {province.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="district"
                  className="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
                >
                  เขต / อำเภอ
                </label>
                <select
                  className="bg-gray-50 border text-lg rounded-lg w-full p-3.5 dark:bg-gray-700"
                  id="district"
                  name="district"
                  onChange={handleDistrictChange}
                  value={formData.district}
                  required
                  disabled={!districts.length}
                >
                  <option value="" disabled>
                    --เลือกเขต/อำเภอ--
                  </option>
                  {districts.map((district) => (
                    <option key={district.name} value={district.name}>
                      {district.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="subdistrict"
                  className="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
                >
                  แขวง / ตำบล
                </label>
                <select
                  className="bg-gray-50 border text-lg rounded-lg w-full p-3.5 dark:bg-gray-700"
                  id="subdistrict"
                  name="subdistrict"
                  onChange={(e) =>
                    setFormData({ ...formData, subdistrict: e.target.value })
                  }
                  value={formData.subdistrict}
                  required
                  disabled={!subdistricts.length}
                >
                  <option value="" disabled>
                    --เลือกแขวง/ตำบล--
                  </option>
                  {subdistricts.map((subdistrict, index) => (
                    <option key={index} value={subdistrict}>
                      {subdistrict}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="map"
                  className="block text-lg/6 font-medium text-gray-900"
                >
                  แผนที่
                </label>
                <div className="mt-2">
                  <GoogleMapSection onLocationSelect={handleLocationSelect} />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="latitude"
                  className="block text-lg font-medium text-gray-900"
                >
                  Latitude
                </label>
                <input
                  type="text"
                  id="latitude"
                  name="latitude"
                  value={formData.latitude}
                  disabled
                  className="bg-gray-50 border text-lg rounded-lg w-full p-3.5 dark:bg-gray-700"
                />
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="longitude"
                  className="block text-lg font-medium text-gray-900"
                >
                  Longitude
                </label>
                <input
                  type="text"
                  id="longitude"
                  name="longitude"
                  value={formData.longitude}
                  disabled
                  className="bg-gray-50 border text-lg rounded-lg w-full p-3.5 dark:bg-gray-700"
                />
              </div>
            </div>
          </div>

          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-xl/7 font-semibold text-gray-900">
              รายละเอียดอสังหาริมทรัพย์เพิ่มเติม
            </h2>
            <p className="mt-1 text-base/6 text-gray-600">
              We'll always let you know about important changes, but you pick
              what else you want to hear about.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-2 sm:col-start-1">
                <label
                  htmlFor="bedroom"
                  className="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
                >
                  ห้องนอน
                </label>
                <select
                  id="bedroom"
                  name="bedroom" // ต้องใช้ name เพื่อให้ handleChange รับค่าได้
                  onChange={handleChange}
                  value={formData.bedroom}
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="0">ห้องสตูดิโอ</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="bathroom"
                  className="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
                >
                  ห้องน้ำ
                </label>
                <select
                  id="bathroom"
                  name="bathroom" // ต้องใช้ name เพื่อให้ handleChange รับค่าได้
                  onChange={handleChange}
                  value={formData.bathroom}
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                </select>
              </div>

              <div className="flex">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="size"
                    className="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
                  >
                    พื้นที่ใช้สอย
                  </label>
                  <input
                    id="size"
                    name="size"
                    onChange={handleChange}
                    value={formData.size}
                    required
                    type="number"
                    placeholder="พื้นที่ใช้สอยภายในห้อง"
                    className="bg-gray-50 border rounded-s-lg border-gray-300 text-gray-900 text-lg focus:ring-blue-500 focus:border-blue-500 block p-3.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-47"
                  />
                </div>
                <div className="sm:col-span-2 bg-gray-200 border rounded-e-lg border-gray-300 text-gray-900 text-lg focus:ring-blue-500 focus:border-blue-500 block p-3.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-40 mt-9 h-14">
                  ตร.ม.
                </div>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-2 sm:col-start-1">
                <label
                  htmlFor="roomNumber"
                  className="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
                >
                  หมายเลขห้อง
                </label>
                <input
                  id="roomNumber"
                  name="roomNumber"
                  onChange={handleChange}
                  value={formData.roomNumber}
                  required
                  type="text"
                  placeholder="หมายเลขห้อง"
                  className="bg-gray-50 border rounded-lg border-gray-300 text-gray-900 text-lg focus:ring-blue-500 focus:border-blue-500 block p-3.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="building"
                  className="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
                >
                  อาคาร
                </label>
                <input
                  id="building"
                  name="building"
                  onChange={handleChange}
                  value={formData.building}
                  type="text"
                  placeholder="ชื่ออาคาร หรือ ตึก"
                  className="bg-gray-50 border rounded-lg border-gray-300 text-gray-900 text-lg focus:ring-blue-500 focus:border-blue-500 block p-3.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="floor"
                  className="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
                >
                  ชั้นที่
                </label>
                <input
                  id="floor"
                  name="floor"
                  type="number"
                  placeholder="ชั้นที่"
                  onChange={handleChange}
                  value={formData.floor}
                  required
                  className="bg-gray-50 border rounded-lg border-gray-300 text-gray-900 text-lg focus:ring-blue-500 focus:border-blue-500 block p-3.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full"
                />
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-2 sm:col-start-1">
                <label
                  htmlFor="parking"
                  className="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
                >
                  ที่จอดรถ
                </label>
                <input
                  id="parking"
                  name="parking"
                  onChange={handleChange}
                  value={formData.parking}
                  type="text"
                  placeholder="จำนวนที่จอดรถ"
                  className="bg-gray-50 border rounded-lg border-gray-300 text-gray-900 text-lg focus:ring-blue-500 focus:border-blue-500 block p-3.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full"
                />
              </div>
            </div>
          </div>

          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-xl font-semibold text-gray-900">
              สิ่งอำนวยความสะดวก
            </h2>
            <p className="mt-1 text-lg text-gray-600">
              ไม่จำเป็นต้องติ๊กทุกช่อง แต่การมีสิ่งอำนวยความสะดวกเยอะ
              อาจมีผลต่อการตัดสินใจ
            </p>
            <div className="col-span-full">
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 justify-center text-lg">
                <div>
                  <input
                    type="checkbox"
                    id="alarmSystem"
                    name="utilities"
                    value="ระบบเตือนภัย"
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label htmlFor="alarmSystem" className="text-gray-700">
                    ระบบเตือนภัย
                  </label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="wifi"
                    name="utilities"
                    value="สัญญาณไวไฟ"
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label htmlFor="wifi" className="text-gray-700">
                    สัญญาณไวไฟ
                  </label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="fitness"
                    name="utilities"
                    value="ฟิตเนส"
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label htmlFor="fitness" className="text-gray-700">
                    ฟิตเนส
                  </label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="commonArea"
                    name="utilities"
                    value="พื้นที่ส่วนกลาง"
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label htmlFor="commonArea" className="text-gray-700">
                    พื้นที่ส่วนกลาง
                  </label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="workspace"
                    name="utilities"
                    value="พื้นที่ทำงาน"
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label htmlFor="workspace" className="text-gray-700">
                    พื้นที่ทำงาน
                  </label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="swimmingPool"
                    name="utilities"
                    value="สระว่ายน้ำ"
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label htmlFor="swimmingPool" className="text-gray-700">
                    สระว่ายน้ำ
                  </label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="cctv"
                    name="utilities"
                    value="กล้องวงจรปิด CCTV"
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label htmlFor="cctv" className="text-gray-700">
                    กล้องวงจรปิด CCTV
                  </label>
                </div>

                {/* เพิ่มช่องกรอกข้อมูล */}
                <div className="col-span-full">
                  <label htmlFor="customUtility" className="text-gray-700">
                    เพิ่ม:
                  </label>
                  <input
                    type="text"
                    id="customUtility"
                    name="customUtility"
                    value={formData.customUtility}
                    placeholder="กรอกสิ่งอำนวยความสะดวก..."
                    onChange={handleChange}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* สถานที่ใกล้เคียง */}
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-xl font-semibold text-gray-900">
              สถานที่ใกล้เคียง (ถ้ามี)
            </h2>
            <p className="mt-1 text-base text-gray-600">
              This information will be displayed publicly so be careful what you
              share.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              {/* มหาวิทยาลัยใกล้เคียง */}
              <div className="sm:col-span-4">
                <label
                  htmlFor="university"
                  className="block text-lg font-medium text-gray-900"
                >
                  มหาวิทยาลัยใกล้เคียง
                </label>
                <input
                  id="university"
                  name="university"
                  onChange={handleChange}
                  value={formData.university}
                  type="text"
                  placeholder="มหาวิทยาลัยใกล้เคียง ภายในรัศมี 10 กิโลเมตร"
                  className="bg-gray-50 border rounded-lg border-gray-300 text-gray-900 text-lg focus:ring-blue-500 focus:border-blue-500 block p-3.5 w-full"
                />
              </div>

              {/* โรงพยาบาลใกล้เคียง */}
              <div className="sm:col-span-4">
                <label
                  htmlFor="hospital"
                  className="block text-lg font-medium text-gray-900"
                >
                  โรงพยาบาลใกล้เคียง
                </label>
                <input
                  id="hospital"
                  name="hospital"
                  onChange={handleChange}
                  value={formData.hospital}
                  type="text"
                  placeholder="โรงพยาบาลใกล้เคียง ภายในรัศมี 10 กิโลเมตร"
                  className="bg-gray-50 border rounded-lg border-gray-300 text-gray-900 text-lg focus:ring-blue-500 focus:border-blue-500 block p-3.5 w-full"
                />
              </div>

              {/* ห้างสรรพสินค้า */}
              <div className="sm:col-span-4">
                <label
                  htmlFor="mall"
                  className="block text-lg font-medium text-gray-900"
                >
                  ห้างสรรพสินค้า
                </label>
                <input
                  id="mall"
                  name="mall"
                  onChange={handleChange}
                  value={formData.mall}
                  type="text"
                  placeholder="ห้างสรรพสินค้า ภายในรัศมี 10 กิโลเมตร"
                  className="bg-gray-50 border rounded-lg border-gray-300 text-gray-900 text-lg focus:ring-blue-500 focus:border-blue-500 block p-3.5 w-full"
                />
              </div>

              {/* โรงเรียนใกล้เคียง */}
              <div className="sm:col-span-4">
                <label
                  htmlFor="school"
                  className="block text-lg font-medium text-gray-900"
                >
                  โรงเรียนใกล้เคียง
                </label>
                <input
                  id="school"
                  name="school"
                  onChange={handleChange}
                  value={formData.school}
                  type="text"
                  placeholder="โรงเรียนใกล้เคียง ภายในรัศมี 10 กิโลเมตร"
                  className="bg-gray-50 border rounded-lg border-gray-300 text-gray-900 text-lg focus:ring-blue-500 focus:border-blue-500 block p-3.5 w-full"
                />
              </div>

              {/* สายรถเมย์ประจำทาง */}
              <div className="sm:col-span-4">
                <label
                  htmlFor="bus"
                  className="block text-lg font-medium text-gray-900"
                >
                  สายรถเมย์ประจำทาง
                </label>
                <input
                  id="bus"
                  name="bus"
                  onChange={handleChange}
                  value={formData.bus}
                  type="text"
                  placeholder="เช่น สาย 8, สาย 44"
                  className="bg-gray-50 border rounded-lg border-gray-300 text-gray-900 text-lg focus:ring-blue-500 focus:border-blue-500 block p-3.5 w-full"
                />
              </div>
            </div>
          </div>

          {/* รูปภาพของอสังหาริมทรัพย์ */}
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-xl font-semibold text-gray-900">
              รูปภาพของอสังหาริมทรัพย์
            </h2>
            <p className="mt-1 text-lg text-gray-600">
              This information will be displayed publicly so be careful what you
              share.
            </p>
            <div className="col-span-full">
              <div className="mt-15 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                <div className="text-center mx-auto">
                  <FaCamera className="mx-auto text-gray-300" />
                  <div className="mt-4 flex text-sm text-gray-600 mx-auto text-center">
                    <label
                      htmlFor="images"
                      className="relative cursor-pointer rounded-md bg-white text-indigo-600 text-lg"
                    >
                      <span>อัปโหลดไฟล์</span>
                      <input
                        id="images"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={(e) => setFiles(Array.from(e.target.files))}
                        multiple
                      />
                    </label>
                    <p className="pl-1 text-lg">
                      หรือ ลากแล้ววาง PNG, JPG, GIF ขนาดสูงสุด 2MB ต่อรูป
                    </p>
                  </div>

                  <div className="grid grid-cols-4 gap-4 mt-4 border-dashed border-2 border-gray-300 p-10 rounded-lg">
                    {formData.imageUrls.length > 0 &&
                      formData.imageUrls.map((url, index) => (
                        <div key={url} className="flex flex-col items-center">
                          <img
                            src={url}
                            alt="รูปภาพอสังหาริมทรัพย์"
                            className="w-40 h-40 object-contain"
                          />

                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="mt-2 p-2 text-red-700 rounded-lg uppercase hover:opacity-75"
                          >
                            ลบ
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              <p className="text-center text-base mt-5">
                สามารถอัปโหลดรูปภาพอสังหาริมทรัพย์ได้สูงสุด 4 รูป
                โดยไม่จำกัดขนาดไฟล์ ขอแนะนำให้อัปโหลดรูปภาพให้ครบทั้ง 4 รูป
                เพื่อให้ผู้ที่สนใจสามารถพิจารณาและติดต่อสอบถามข้อมูลเพิ่มเติมได้
              </p>
              <span className="text-center text-red-600 bg-red-200">
                {imageUploadError && imageUploadError}
              </span>
            </div>
          </div>

          {/* ข้อมูลติดต่อ */}
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-xl font-semibold text-gray-900">
              ข้อมูลติดต่อ
            </h2>
            <p className="mt-1 text-lg text-gray-600">
              This information will be displayed publicly so be careful what you
              share.
            </p>

            {/* อีเมล */}
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-lg font-medium text-gray-900"
              >
                อีเมล
              </label>
              <input
                className="bg-gray-50 border rounded-lg border-gray-300 text-gray-900 text-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3.5"
                id="email"
                name="email"
                type="email"
                onChange={handleChange}
                defaultValue={currentUser.email}
                required
                disabled
              />
            </div>

            {/* หมายเลขโทรศัพท์ */}
            <div className="mb-6">
              <label
                htmlFor="phone"
                className="block text-lg font-medium text-gray-900"
              >
                หมายเลขโทรศัพท์
              </label>
              <input
                className="bg-gray-50 border rounded-lg border-gray-300 text-gray-900 text-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3.5"
                id="phone"
                name="phone"
                type="text"
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                onChange={handleChange}
                defaultValue={currentUser.phone}
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                กรุณาตรวจสอบให้แน่ใจว่าหมายเลขโทรศัพท์หลักของคุณสามารถเปิดเผยต่อสาธารณะได้
              </p>
            </div>

            {/* LINE ID */}
            <div className="mb-6">
              <label
                htmlFor="lineId"
                className="block text-lg font-medium text-gray-900"
              >
                LINE ID
              </label>
              <input
                className="bg-gray-50 border rounded-lg border-gray-300 text-gray-900 text-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3.5"
                id="lineId"
                name="lineId"
                type="text"
                onChange={handleChange}
                defaultValue={currentUser.lineId}
                required
              />
            </div>
          </div>

          {/* ปุ่มบันทึก */}
          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              className="text-sm font-semibold text-gray-900"
              type="button"
              onClick={handleCancel}
            >
              ยกเลิก
            </button>
            <button
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
              type="submit"
              disabled={loading || uploading}
            >
              {loading ? "กำลังสร้างโพสต์..." : "สร้างโพสต์"}
            </button>
            {error && <p className="text-red-700">{error}</p>}
          </div>
        </div>
      </form>
    </main>
  );
}

export default CreateListing;
