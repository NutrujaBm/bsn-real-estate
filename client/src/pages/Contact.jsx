import React from "react";
import Swal from "sweetalert2";

function Contact() {
  const [result, setResult] = React.useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    const currentScroll = window.scrollY; // เก็บตำแหน่ง scroll ปัจจุบัน

    setResult("กำลังส่ง...");

    const formData = new FormData(event.target);
    formData.append("access_key", "aa168bb1-0f76-41e9-aa1b-5ca2f5283b4b");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire({
          title: "สำเร็จ",
          text: "ข้อความส่งสำเร็จ!",
          icon: "success",
        }).then(() => {
          window.scrollTo(0, currentScroll); // เลื่อนกลับไปยังตำแหน่งเดิม
        });
        setResult("");
      } else {
        console.error("Error", data);
        setResult(data.message);
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
      setResult("เกิดข้อผิดพลาดในการส่งข้อมูล");
      window.scrollTo(0, currentScroll); // เลื่อนกลับไปยังตำแหน่งเดิม
    }
  };

  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-2 w-full min-h-[88.9vh] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/bg-home.jpg')" }}
    >
      {/* Google Map */}
      <div className="flex justify-center items-center lg:mt-25 lg:ml-70">
        <iframe
          title="Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387239.7206819935!2d100.50144048239577!3d13.756331020350488!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29ec3e1b0a72b%3A0x70b2c5e7c6bb71af!2sBangkok%2C%20Thailand!5e0!3m2!1sen!2sus!4v1616320726010!5m2!1sen!2sus"
          className="w-full md:w-[600px] h-40 md:h-80 lg:h-[630px] rounded-lg shadow-lg mt-[-120px] md:mt-[-10px] lg:mt-[-100px]"
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>

      {/* แบบฟอร์มติดต่อ */}
      <div className="flex justify-center items-center p-6 md:p-8 mt-[-260px] md:mt-[-10px] lg:mt-1 lg:mr-99">
        <div className="max-w-lg w-full bg-white p-6 rounded-lg shadow-lg">
          <form onSubmit={onSubmit}>
            <h2 className="text-xl md:text-2xl font-semibold text-center">
              ติดต่อพวกเรา
            </h2>
            <p className="text-center text-gray-600 mt-2 text-sm md:text-base">
              เราจะตอบกลับทันทีที่เราได้รับข้อความของคุณ
            </p>

            {/* ชื่อ-นามสกุล */}
            <div className="mt-4">
              <label
                htmlFor="name"
                className="block text-gray-700 text-sm md:text-base"
              >
                ชื่อ-นามสกุล
              </label>
              <input
                type="text"
                name="name"
                placeholder="กรอกชื่อ - นามสกุลของคุณ"
                className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                required
              />
            </div>

            {/* อีเมล */}
            <div className="mt-4">
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm md:text-base"
              >
                อีเมล
              </label>
              <input
                type="email"
                name="email"
                placeholder="กรอกอีเมลของคุณ"
                className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                required
              />
            </div>

            {/* เบอร์โทรติดต่อ */}
            <div className="mt-4">
              <label
                htmlFor="phone"
                className="block text-gray-700 text-sm md:text-base"
              >
                เบอร์โทรติดต่อ
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="กรอกเบอร์โทรติดต่อของคุณ"
                className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                required
              />
            </div>

            {/* ข้อความ */}
            <div className="mt-4">
              <label
                htmlFor="message"
                className="block text-gray-700 text-sm md:text-base"
              >
                ข้อความ
              </label>
              <textarea
                name="message"
                placeholder="กรอกข้อความของคุณ"
                className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-25 resize-none text-sm md:text-base"
                required
              ></textarea>
            </div>

            {/* ปุ่มส่งข้อความ */}
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold p-3 rounded-lg mt-4 transition duration-300 text-sm md:text-base"
            >
              ส่งข้อความ
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;
