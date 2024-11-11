import { useSelector } from "react-redux";
import { FaLine, FaEnvelope, FaPhoneAlt, FaCopy } from "react-icons/fa";

function Profile() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">โปรไฟล์ของคุณ</h1>
        <p className="text-gray-600 mt-2">จัดการข้อมูลส่วนตัวของคุณ</p>
      </div>

      {/* Avatar */}
      <div className="flex justify-center my-8">
        <img
          src={currentUser.avatar}
          alt="profile"
          className="rounded-full w-40 h-40 border-4 border-gray-800"
        />
      </div>

      {/* Username */}
      <div className="mb-6">
        <label className="block mb-2 text-base font-medium text-gray-900">
          ชื่อผู้ใช้
        </label>
        <input
          type="text"
          defaultValue={currentUser.username}
          className="bg-gray-50 border rounded-lg border-gray-300 text-gray-900 text-base focus:ring-blue-500 focus:border-blue-500 block p-3.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 pl-5 w-full"
        />
      </div>

      {/* Name */}
      <div className="grid gap-6 mb-3 md:grid-cols-2">
        <div className="mb-6">
          <label className="block mb-2 text-base font-medium text-gray-900">
            ชื่อ
          </label>
          <input
            type="text"
            defaultValue={currentUser.firstName}
            className="bg-gray-50 border rounded-lg border-gray-300 text-gray-900 text-base focus:ring-blue-500 focus:border-blue-500 block p-3.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 pl-5 w-full"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-base font-medium text-gray-900">
            นามสกุล
          </label>
          <input
            type="text"
            defaultValue={currentUser.lastName}
            className="bg-gray-50 border rounded-lg border-gray-300 text-gray-900 text-base focus:ring-blue-500 focus:border-blue-500 block p-3.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 pl-5 w-full"
          />
        </div>
      </div>

      {/* About Me */}
      <div className="mb-6">
        <label className="block mb-2 text-base font-medium text-gray-900">
          เกี่ยวกับฉัน
        </label>
        <textarea
          defaultValue={
            currentUser.aboutMe || "กรุณากรอกข้อมูลเกี่ยวกับตัวคุณ..."
          }
          className="bg-gray-50 border rounded-lg border-gray-300 text-gray-900 text-base focus:ring-blue-500 focus:border-blue-500 block p-3.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 pl-5 w-full"
        ></textarea>
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
              type="text"
              defaultValue={currentUser.email}
              className="bg-gray-50 border border-e-0 border-gray-300 text-gray-900 text-base rounded-s-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 pl-10"
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
              type="text"
              defaultValue={currentUser.phone}
              className="bg-gray-50 border border-e-0 border-gray-300 text-gray-900 text-base rounded-s-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 pl-10"
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
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
              type="text"
              defaultValue={currentUser.lineId}
              className="bg-gray-50 border border-e-0 border-gray-300 text-gray-900 text-base rounded-s-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 pl-10"
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

      <div className="w-full border-t border-gray-300 mx-auto my-4 mt-10"></div>

      {/* Address */}
      <div className="mb-6">
        <label className="block mb-2 text-base font-medium text-gray-900 ">
          ที่อยู่
        </label>
        <textarea
          defaultValue={currentUser.address}
          className="bg-gray-50 border rounded-lg border-gray-300 text-gray-900 text-base focus:ring-blue-500 focus:border-blue-500 block p-3.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 pl-5 w-full mb-12"
          disabled
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
            type="text"
            defaultValue={currentUser.idCard}
            className="bg-gray-50 border rounded-lg border-gray-300 text-gray-900 text-base focus:ring-blue-500 focus:border-blue-500 block p-3.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 pl-5 w-full"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-base font-medium text-gray-900">
            พาสปอร์ต (สำหรับชาวต่างชาติ)
          </label>
          <input
            type="text"
            defaultValue={currentUser.passport}
            className="bg-gray-50 border rounded-lg border-gray-300 text-gray-900 text-base focus:ring-blue-500 focus:border-blue-500 block p-3.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 pl-5 w-full"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-center">
        <button
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          บันทึกการแก้ไข
        </button>
      </div>
    </div>
  );
}

export default Profile;
