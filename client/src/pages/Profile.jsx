import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { FaLine, FaEnvelope, FaPhoneAlt, FaCopy } from "react-icons/fa";
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

function Profile() {
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

  console.log(formData);
  // console.log(userListings);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);

    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!data.success) {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
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

  return (
    <div className="max-w-3xl mx-auto p-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">แก้ไขโปรไฟล์ของคุณ</h1>
        <p className="text-gray-600 mt-2">จัดการข้อมูลส่วนตัวของคุณ</p>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        {/* Avatar */}
        <div className="flex justify-center my-8">
          <img
            onClick={() => fileRef.current.click()}
            src={formData.avatar || currentUser.avatar}
            alt="profile"
            className="rounded-full w-40 h-40 border-4 border-gray-800"
          />
        </div>

        <p className="text-base self-center text-center mb-5 ">
          {fileUploadError ? (
            <span className="text-red-700">
              เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ (ขนาดรูปภาพต้องไม่เกิน 2 MB)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`กำลังอัปโหลด $(filePerc)%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">อัปโหลดรูปภาพเรียบร้อยแล้ว!</span>
          ) : (
            ""
          )}
        </p>

        {/* Username */}
        <div className="mb-6">
          <label className="block mb-2 text-base font-medium text-gray-900">
            ชื่อผู้ใช้
          </label>
          <input
            id="username"
            type="text"
            defaultValue={currentUser.username}
            className="bg-gray-50 border rounded-lg border-gray-300 text-gray-900 text-base focus:ring-blue-500 focus:border-blue-500 block p-3.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 px-5 w-full"
            onChange={handleChange}
          />
        </div>

        {/* Name */}
        <div className="grid gap-6 mb-3 md:grid-cols-2">
          <div className="mb-6">
            <label className="block mb-2 text-base font-medium text-gray-900">
              ชื่อ
            </label>
            <input
              id="firstName"
              type="text"
              defaultValue={currentUser.firstName}
              onChange={handleChange}
              className="bg-gray-50 border rounded-lg border-gray-300 text-gray-900 text-base focus:ring-blue-500 focus:border-blue-500 block p-3.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-base font-medium text-gray-900">
              นามสกุล
            </label>
            <input
              id="lastName"
              type="text"
              defaultValue={currentUser.lastName}
              onChange={handleChange}
              className="bg-gray-50 border rounded-lg border-gray-300 text-gray-900 text-base focus:ring-blue-500 focus:border-blue-500 block p-3.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full"
            />
          </div>
        </div>

        {/* About Me */}
        <div className="mb-6">
          <label className="block mb-2 text-base font-medium text-gray-900">
            เกี่ยวกับฉัน
          </label>
          <textarea
            id="aboutMe"
            defaultValue={currentUser.aboutMe || ""}
            placeholder="กรุณากรอกข้อมูลเกี่ยวกับตัวคุณ..."
            onChange={handleChange}
            className="bg-gray-50 border rounded-lg border-gray-300 text-gray-900 text-base focus:ring-blue-500 focus:border-blue-500 block p-3.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full"
          ></textarea>
          <p className="mt-3 text-sm/6 text-gray-600">
            Write a few sentences about yourself.
          </p>
        </div>

        <div className="w-full border-t border-gray-300 mx-auto my-4 mt-10"></div>

        {/* Contact Information Section */}
        <h1 className="text-xl font-semibold text-center my-7 mt-10">
          ข้อมูลติดต่อ
        </h1>
        <p className="tracking-wider text-gray-500 md:text-lg dark:text-gray-400 mb-10 text-center">
          จัดการข้อมูลการติดต่อของคุณเพื่อให้ข้อมูลติดต่อของคุณถูกต้องแม่นยำและเป็นปัจจุบัน
        </p>
        {/* Email */}
        <div className="mb-6">
          <label className="block mb-2 text-base font-medium text-gray-900">
            อีเมล
          </label>
          <div className="flex items-center">
            <div className="relative w-full">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                <FaEnvelope className="inline mr-2 w-4 h-4 text-red-500" />
              </div>
              <input
                id="email"
                type="text"
                defaultValue={currentUser.email}
                className="bg-gray-50 border border-e-0 border-gray-300 text-gray-900 text-base rounded-s-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 pl-11"
                disabled
              />
            </div>
            <button
              id="copy-number"
              data-copy-to-clipboard-target="phone-numbers"
              data-tooltip-target="tooltip-phone"
              className="flex-shrink-0 z-10 inline-flex items-center py-4 px-4 text-base font-medium text-center text-gray-500 dark:text-gray-400 hover:text-gray-900 bg-gray-100 border border-gray-300 rounded-e-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:hover:text-white dark:border-gray-600"
              type="button"
            >
              <FaCopy className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Phone Number */}
        <div className="mb-6">
          <label className="block mb-2 text-base font-medium text-gray-900">
            หมายเลขโทรศัพท์
          </label>
          <div className="flex items-center">
            <div className="relative w-full">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                <FaPhoneAlt className="inline mr-2 w-4 h-4 text-blue-500" />
              </div>
              <input
                id="phone"
                type="text"
                defaultValue={currentUser.phone}
                onChange={handleChange}
                className="bg-gray-50 border border-e-0 border-gray-300 text-gray-900 text-base rounded-s-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 pl-11"
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              />
            </div>
            <button
              id="copy-number"
              data-copy-to-clipboard-target="phone-numbers"
              data-tooltip-target="tooltip-phone"
              className="flex-shrink-0 z-10 inline-flex items-center py-4 px-4 text-base font-medium text-center text-gray-500 dark:text-gray-400 hover:text-gray-900 bg-gray-100 border border-gray-300 rounded-e-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:hover:text-white dark:border-gray-600"
              type="button"
            >
              <FaCopy className="w-5 h-5" />
            </button>
          </div>
          <p
            id="helper-text-explanation"
            className="mt-2 text-base text-gray-500 dark:text-gray-400"
          >
            กรุณาตรวจสอบให้แน่ใจว่าหมายเลขโทรศัพท์หลักของคุณสามารถเปิดเผยต่อสาธารณะได้
          </p>
        </div>

        {/* Line ID */}
        <div className="mb-6">
          <label className="block mb-2 text-base font-medium text-gray-900">
            LINE ID
          </label>
          <div className="flex items-center">
            <div className="relative w-full">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                <FaLine
                  className="inline mr-2 w-6 h-6"
                  style={{ color: "#00C300" }}
                />
              </div>
              <input
                id="lineId"
                type="text"
                defaultValue={currentUser.lineId}
                onChange={handleChange}
                className="bg-gray-50 border border-e-0 border-gray-300 text-gray-900 text-base rounded-s-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 pl-12"
              />
            </div>
            <button
              id="copy-number"
              data-copy-to-clipboard-target="phone-numbers"
              data-tooltip-target="tooltip-phone"
              className="flex-shrink-0 z-10 inline-flex items-center py-4 px-4 text-base font-medium text-center text-gray-500 dark:text-gray-400 hover:text-gray-900 bg-gray-100 border border-gray-300 rounded-e-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:hover:text-white dark:border-gray-600"
              type="button"
            >
              <FaCopy className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="w-full border-t border-gray-300 mx-auto my-4 mt-10"></div>

        {/* Address */}
        <div className="mb-6">
          <label className="block mb-2 text-base font-medium text-gray-900 ">
            ที่อยู่
          </label>
          <textarea
            id="address"
            defaultValue={currentUser.address}
            onChange={handleChange}
            className="bg-gray-50 border rounded-lg border-gray-300 text-gray-900 text-base focus:ring-blue-500 focus:border-blue-500 block p-3.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full"
          ></textarea>
        </div>

        <div className="w-full border-t border-gray-300 mx-auto my-4 mt-10"></div>

        {/* Id Card or Passport*/}
        <h1 className="text-xl font-semibold text-center my-7 mt-10">
          ข้อมูลการยืนยันตัวตน
        </h1>
        <p className="tracking-wider text-gray-500 md:text-lg dark:text-gray-400 mb-10 text-center">
          จัดการข้อมูลที่จำเป็นสำหรับการยืนยันตัวตนของคุณ
          ข้อมูลนี้จะช่วยให้เรารักษาความปลอดภัยและป้องกันการเข้าถึงที่ไม่ได้รับอนุญาตในบัญชีของคุณ
        </p>
        <div className="grid gap-6 mb-6 md:grid-cols-2">
          <div className="mb-6">
            <label className="block mb-2 text-base font-medium text-gray-900">
              เลขบัตรประชาชน (สำหรับคนไทย)
            </label>
            <input
              id="idCard"
              type="text"
              defaultValue={currentUser.idCard}
              onChange={handleChange}
              className="bg-gray-50 border rounded-lg border-gray-300 text-gray-900 text-base focus:ring-blue-500 focus:border-blue-500 block p-3.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-base font-medium text-gray-900">
              พาสปอร์ต (สำหรับชาวต่างชาติ)
            </label>
            <input
              id="passport"
              type="text"
              defaultValue={currentUser.passport}
              onChange={handleChange}
              className="bg-gray-50 border rounded-lg border-gray-300 text-gray-900 text-base focus:ring-blue-500 focus:border-blue-500 block p-3.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-center">
          <button
            disabled={loading}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            {loading ? "กำลังบันทึกการแก้ไข..." : "บันทึกการแก้ไข"}
          </button>
        </div>
      </form>
      <p className="text-red-700 mt-5">{error ? error : ""}</p>
      <p className="text-green-700 mt-5">
        {updateSuccess ? "ข้อมูลของคุณถูกอัปเดตเรียบร้อยแล้ว!" : ""}
      </p>
    </div>
  );
}

export default Profile;
