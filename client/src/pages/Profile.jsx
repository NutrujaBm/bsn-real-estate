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
  const [formData, setFormData] = useState({
    phone: currentUser.phone || "", // Initialize with current user phone
    avatar: currentUser.avatar || "", // Initialize with current user avatar
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [phoneError, setPhoneError] = useState(false);

  const dispatch = useDispatch();

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
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData((prevData) => ({ ...prevData, avatar: downloadURL }))
        );
      }
    );
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    let updatedValue = value;

    // Format the phone number if it's being changed
    if (id === "phone") {
      let formattedPhone = value.replace(/\D/g, ""); // Remove non-numeric characters
      if (formattedPhone.length > 3 && formattedPhone.length <= 6) {
        formattedPhone = formattedPhone.replace(/(\d{3})(\d{0,3})/, "$1-$2");
      } else if (formattedPhone.length > 6) {
        formattedPhone = formattedPhone.replace(
          /(\d{3})(\d{3})(\d{0,4})/,
          "$1-$2-$3"
        );
      }
      updatedValue = formattedPhone; // Use the formatted phone number

      // ตรวจสอบว่าเป็นหมายเลขโทรศัพท์ที่มี 10 หลัก
      setPhoneError(updatedValue.length !== 12); // ฟอร์แมตแล้วรวมขีด "-" จึงจะเป็น 12 ตัว
    }

    // Update the form data state
    setFormData((prevData) => ({ ...prevData, [id]: updatedValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.phone.length !== 12) {
      alert("หมายเลขโทรศัพท์ต้องมี 10 หลัก ");
      return;
    }
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
          <p className="mt-3 text-sm/6 text-gray-600"></p>
        </div>

        <div className="w-full border-t border-b border-gray-300 mx-auto mt-10">
          {/* Address */}
          <div className="mb-6">
            <label className="block mb-2 mt-5 text-base font-medium text-gray-900 ">
              ที่อยู่
            </label>
            <textarea
              id="address"
              defaultValue={currentUser.address}
              onChange={handleChange}
              className="bg-gray-50 border rounded-lg mb-10 border-gray-300 text-gray-900 text-base focus:ring-blue-500 focus:border-blue-500 block p-3.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full"
            ></textarea>
          </div>
        </div>

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
                value={formData.phone} // Use formatted phone number as value
                onChange={handleChange}
                className="bg-gray-50 border border-e-0 border-gray-300 text-gray-900 text-base rounded-s-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 pl-11"
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
          {phoneError && (
            <p className="text-red-500 text-xs mt-2">
              หมายเลขโทรศัพท์ต้องมี 10 หลัก
            </p>
          )}
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
