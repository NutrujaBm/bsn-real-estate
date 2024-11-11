function Password() {
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        เปลี่ยนรหัสผ่าน
      </h1>
      <div className="mb-6">
        <label className="block mb-2 text-base font-medium text-gray-900">
          รหัสผ่านปัจจุบัน
        </label>
        <input
          type="password"
          placeholder="ใส่รหัสปัจจุบัน"
          className="border p-3 rounded-lg text-base w-full"
        />
      </div>
      <div className="mb-6">
        <label className="block mb-2 text-base font-medium text-gray-900">
          รหัสผ่านใหม่
        </label>
        <input
          type="password"
          placeholder="ใส่รหัสผ่านใหม่"
          className="border p-3 rounded-lg text-base w-full"
        />
      </div>
      <div className="mb-6">
        <label className="block mb-2 text-base font-medium text-gray-900">
          ยืนยันรหัสผ่านใหม่
        </label>
        <input
          type="password"
          placeholder="ยืนยันรหัสผ่านใหม่"
          className="border p-3 rounded-lg text-base w-full"
        />
      </div>
      <button className="bg-blue-600 text-white p-3 rounded-lg uppercase text-center hover:opacity-95">
        เปลี่ยนรหัสผ่าน
      </button>
    </div>
  );
}

export default Password;
