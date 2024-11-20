import React from "react";
import Swal from "sweetalert2";

function Contact() {
  const [result, setResult] = React.useState("");

  // ฟังก์ชันสำหรับจัดการการส่งแบบฟอร์ม
  const onSubmit = async (event) => {
    event.preventDefault();
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
        });
        setResult("");
      } else {
        console.error("Error", data);
        setResult(data.message);
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
      setResult("เกิดข้อผิดพลาดในการส่งข้อมูล");
    }
  };

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 w-full h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/bg-home.jpg')" }}
    >
      {/* แบบฟอร์มติดต่อ */}
      <div className="max-w-2xl bg-white p-6 md:p-8 rounded-lg shadow-lg mt-10 h-3/4 ml-50">
        <form onSubmit={onSubmit}>
          <h2 className="text-2xl md:text-3xl font-semibold text-center">
            ติดต่อพวกเรา
          </h2>
          <p className="text-center text-gray-600 mt-2">
            เราจะตอบกลับทันทีที่เราได้รับข้อความของคุณ
          </p>

          {/* ชื่อ-นามสกุล */}
          <div className="mt-4">
            <label htmlFor="name" className="block text-gray-700">
              ชื่อ-นามสกุล
            </label>
            <input
              type="text"
              name="name"
              placeholder="กรอกชื่อ - นามสกุลของคุณ"
              className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* อีเมล */}
          <div className="mt-4">
            <label htmlFor="email" className="block text-gray-700">
              อีเมล
            </label>
            <input
              type="email"
              name="email"
              placeholder="กรอกอีเมลของคุณ"
              className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* เบอร์โทรติดต่อ */}
          <div className="mt-4">
            <label htmlFor="phone" className="block text-gray-700">
              เบอร์โทรติดต่อ
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="กรอกเบอร์โทรติดต่อของคุณ"
              className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* ข้อความ */}
          <div className="mt-4">
            <label htmlFor="message" className="block text-gray-700">
              ข้อความ
            </label>
            <textarea
              name="message"
              placeholder="กรอกข้อความของคุณ"
              className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
              required
            ></textarea>
          </div>

          {/* ปุ่มส่งข้อความ */}
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-blue-500 text-white font-semibold p-3 rounded-lg mt-4 transition duration-300"
          >
            ส่งข้อความ
          </button>
        </form>
      </div>

      {/* Google Map */}
      <div className="mt-10 mr-50 ">
        <div className="flex justify-center items-center px-2 md:px-8">
          <iframe
            title="Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387239.7206819935!2d100.50144048239577!3d13.756331020350488!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29ec3e1b0a72b%3A0x70b2c5e7c6bb71af!2sBangkok%2C%20Thailand!5e0!3m2!1sen!2sus!4v1616320726010!5m2!1sen!2sus"
            className="w-full h-[600px] md:h-[720px] rounded-lg shadow-lg"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default Contact;
