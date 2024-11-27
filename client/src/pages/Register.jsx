import React, { useState } from "react";
import { set } from "mongoose";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import { IoIosClose } from "react-icons/io";

function Register() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false); // State for popup visibility

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    console.log(formData); // To verify state updates correctly
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password validation
    if (formData.password !== formData.confirm_password) {
      setError("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }

    if (formData.password.length < 8) {
      setError("รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);

      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate("/login");
    } catch (error) {
      setLoading(false);
      setError("เกิดข้อผิดพลาดในการสมัครสมาชิก");
    }
  };

  const togglePopup = () => {
    setShowPopup((prev) => !prev); // Toggle popup visibility
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold mt-16">สมัครสมาชิก</h1>
      <p className="text-center text-zinc-500 dark:text-zinc-400 mt-2 mb-10 text-lg">
        สร้างบัญชีฟรีด้วยอีเมลของคุณ
      </p>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label
            htmlFor="username"
            className="block mb-2 text-base font-medium text-gray-900 dark:text-white"
          >
            ชื่อผู้ใช้
          </label>
          <input
            type="text"
            id="username"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="กรุณากรอกชื่อผู้ใช้"
            required
            onChange={handleChange}
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="email"
            className="block mb-2 text-base font-medium text-gray-900 dark:text-white"
          >
            อีเมล
          </label>
          <input
            type="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="example@gmail.com"
            required
            onChange={handleChange}
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block mb-2 text-base font-medium text-gray-900 dark:text-white"
          >
            รหัสผ่าน
          </label>
          <input
            type="password"
            id="password"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="กรุณากรอกรหัสผ่านที่มีความยาวอย่างน้อย 8 ตัวอักษร"
            required
            onChange={handleChange}
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="confirm_password"
            className="block mb-2 text-base font-medium text-gray-900 dark:text-white"
          >
            ยืนยันรหัสผ่าน
          </label>
          <input
            type="password"
            id="confirm_password"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="ยืนยันรหัสผ่านให้ตรงกับรหัสผ่านที่กรอกไว้ก่อนหน้านี้"
            required
            onChange={handleChange}
          />
        </div>
        <div className="flex items-center  mb-5">
          <div className="flex items-center h-5">
            <input
              id="terms"
              type="checkbox"
              value=""
              className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
              required
            />
          </div>
          <label
            htmlFor="terms"
            className="ml-2 text-base text-gray-900 dark:text-gray-300"
          >
            ยอมรับเงื่อนไขข้อตกลง{" "}
            <a
              href="#"
              className="text-blue-600 underline dark:text-blue-500"
              onClick={togglePopup}
            >
              คลิกที่นี่
            </a>
            <span className="mx-1">เพื่ออ่าน</span>
          </label>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-5 text-lg text-white bg-[#5ece4f] rounded-lg mt-2 cursor-pointer font-medium"
        >
          {loading ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
        </button>
      </form>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[800px] h-[500px] overflow-y-auto">
            <div className="form-content ">
              <div className="form-title mb-4">
                <button
                  onClick={togglePopup}
                  className="absolute top-60 right-25 text-gray-700"
                >
                  <IoIosClose className="w-10 h-10" />
                </button>
                <h3 className="text-xl font-semibold mr-10">
                  เพื่อป้องกันสิทธิส่วนบุคคลของท่านกรุณารับทราบข้อกำหนดการใช้งานและ
                  การป้องกันข้อมูลส่วนบุคคลของท่าน
                </h3>
              </div>

              <hr className="form-line my-4 border-t-2 border-gray-300" />

              <div className="terms-title">
                <div className="text-title mb-2">
                  <span className="text-lg font-medium">
                    ข้อกำหนดการใช้งานและนโยบายความเป็นส่วนตัว
                  </span>
                </div>

                <div className="terms-desc mb-6">
                  <p className="terms-text text-base text-gray-700">
                    BSN Real Estate
                    เป็นเว็บไซต์ที่ให้บริการด้านอสังหาริมทรัพย์ซึ่งจัดทำขึ้นเป็นส่วนหนึ่งของโครงการสำเร็จการศึกษา
                    โดยนักศึกษาจากคณะเทคโนโลยี
                    กรุณาอ่านรายละเอียดข้อกำหนดและนโยบายด้านล่าง
                    เพื่อการใช้งานเว็บไซต์อย่างเหมาะสมและปลอดภัย
                  </p>
                </div>

                <div className="terms-list">
                  {/* ข้อกำหนดการใช้บริการ */}
                  <div className="terms-item mb-4">
                    <em className="option point text-sm text-red-500">
                      [จำเป็น]
                    </em>
                    <div className="text-wrap flex justify-between items-center">
                      <span className="text-base">
                        ยอมรับข้อกำหนดการใช้บริการ
                      </span>
                      {/* <a
                        href="#"
                        className="link-arrow text-blue-500 hover:underline"
                      >
                        ดูรายละเอียดทั้งหมด
                      </a> */}
                    </div>

                    <div className="terms-box mt-2 bg-gray-100 p-4 rounded-md">
                      <div className="article">
                        <h3 className="article-title text-base font-semibold mb-2">
                          ยินต้อนรับเข้าสู่ BSN Real Estate!
                        </h3>
                        <p className="article-text mb-4 text-base">
                          ก่อนใช้บริการเว็บไซต์ เราขอความร่วมมือ
                          กรุณาอ่านข้อกำหนดในการให้บริการและเงื่อนไขการใช้บริการ
                          ของเว็บไซต์ประกอบกับนโยบายความเป็นส่วนตัวให้ละเอียดถี่ถ้วนและให้ถือว่าการใช้งานเว็บไซต์นี้
                          แสดงถึงการยอมรับข้อตกลงและการยินยอมในการปฎิบัติตามข้อกำหนดและเงื่อนไขต่างๆด้านล่าง
                        </p>

                        <h3 className="article-title text-base font-medium mb-2">
                          ข้อกำหนดการใช้บริการ
                        </h3>
                        <ul className="paragraph-text list-inside list-disc text-gray-700 text-base">
                          <li>
                            - เนื้อหาบนเว็บไซต์นี้ รวมถึงข้อความ ภาพ กราฟิก
                            และซอฟต์แวร์ เป็นทรัพย์สินของบริษัท BSN
                            และได้รับการคุ้มครองตามกฎหมายลิขสิทธิ์
                          </li>
                          <li>
                            - ห้ามคัดลอก ดัดแปลง
                            หรือเผยแพร่เนื้อหาจากเว็บไซต์โดยไม่ได้รับอนุญาตเป็นลายลักษณ์อักษร
                          </li>
                          <li>
                            -
                            การละเมิดสิทธิ์อาจนำไปสู่การดำเนินการทางกฎหมายทั้งทางแพ่งและอาญา
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* นโยบายความเป็นส่วนตัว */}
                  <div className="terms-item mb-4">
                    <em className="option point text-sm text-red-500">
                      [จำเป็น]
                    </em>
                    <div className="text-wrap flex justify-between items-center">
                      <span className="text-base">
                        ข้อมูลเกี่ยวกับการเก็บรวบรวมและใช้ข้อมูลส่วนบุคคล
                      </span>
                      {/* <a
                        href="#"
                        className="link-arrow text-blue-500 hover:underline"
                      >
                        ดูรายละเอียดทั้งหมด
                      </a> */}
                    </div>

                    <div className="terms-box mt-2 bg-gray-100 p-4 rounded-md">
                      <div className="article">
                        <h3 className="article-title text-base font-semibold mb-2">
                          นโยบายความเป็นส่วนตัว
                        </h3>
                        <p className="article-text mb-4 text-base">
                          เราขอชี้แจงนโยบายเกี่ยวกับการเก็บรวบรวม ใช้
                          และจัดเก็บข้อมูลส่วนบุคคล ดังนี้
                        </p>
                        <h4 className="article-title-decs text-base font-medium mb-2">
                          ข้อมูลส่วนบุคคลที่เก็บรวบรวม
                        </h4>
                        <ul className="paragraph-text list-inside list-disc text-gray-700 mb-4 text-base">
                          <li>
                            - ข้อมูลการติดต่อ: ชื่อ-นามสกุล, ที่อยู่,
                            หมายเลขโทรศัพท์, อีเมล, เลขบัตรประชาชน, พาสปอร์ต
                          </li>
                          <li>
                            - ข้อมูลระบบและกิจกรรม: IP Address,
                            ข้อมูลการเข้าสู่ระบบ, Log การใช้งาน
                          </li>
                          <li>
                            - คุกกี้:
                            ใช้เพื่อวิเคราะห์พฤติกรรมผู้ใช้และปรับปรุงประสบการณ์การใช้งาน
                          </li>
                        </ul>

                        <h4 className="paragraph-title text-base font-medium mb-2">
                          วัตถุประสงค์ในการประมวลผลข้อมูล
                        </h4>
                        <ul className="paragraph-text list-inside list-disc text-gray-700 mb-4 text-base">
                          <li>
                            ปรับปรุงบริการและวิเคราะห์การใช้งานของผู้ใช้
                            และป้องกันการทุจริตและตรวจสอบการใช้งานที่ไม่ชอบด้วยกฎหมาย
                          </li>
                        </ul>

                        <h4 className="article-title-decs text-base font-medium mb-2">
                          การแบ่งปันข้อมูลส่วนบุคคล
                        </h4>
                        <p className="paragraph-text text-gray-700 mb-4 text-base">
                          ข้อมูลของท่านจะไม่ถูกเปิดเผยแก่บุคคลที่สาม
                          ยกเว้นในกรณีที่จำเป็นต่อการดำเนินบริการ
                          หรือเป็นไปตามข้อกำหนดของกฎหมาย
                        </p>

                        <h4 className="article-title-decs text-base font-medium mb-2">
                          การจัดเก็บและลบข้อมูลส่วนบุคคล
                        </h4>
                        <p className="paragraph-text text-gray-700 mb-4 text-base">
                          ข้อมูลของท่านจะถูกจัดเก็บอย่างปลอดภัย
                          และท่านสามารถแก้ไขได้ทุกเมื่อผ่านบัญชีของท่าน
                          หากท่านต้องการลบบัญชี กรุณาติดต่อเราผ่าน{" "}
                          <a
                            href="mailto:example@email.com"
                            className="text-blue-500 hover:underline"
                          >
                            example@email.com
                          </a>
                        </p>

                        <h4 className="paragraph-title text-base font-medium mb-2">
                          สิทธิของผู้ใช้บริการ
                        </h4>
                        <ul className="paragraph-text list-inside list-disc text-gray-700 mb-4 text-base">
                          <li>- ขอเข้าถึงข้อมูลส่วนบุคคลของท่าน</li>
                          <li>- ขอแก้ไขหรือระงับการใช้ข้อมูลบางส่วน</li>
                          <li>
                            - ขอลบบัญชีและข้อมูลส่วนบุคคล
                            (ต้องติดต่อเจ้าหน้าที่)
                          </li>
                        </ul>

                        <h4 className="article-title-decs text-base font-medium mb-2">
                          การเปลี่ยนแปลงนโยบายความเป็นส่วนตัว
                        </h4>
                        <p className="paragraph-text text-gray-700 mb-4 text-base">
                          เราอาจปรับปรุงนโยบายนี้เป็นระยะ
                          ท่านควรตรวจสอบนโยบายนี้เป็นประจำ
                          เพื่อรับทราบการเปลี่ยนแปลงล่าสุด
                        </p>

                        <h4 className="article-title-decs text-base font-medium mb-2">
                          ช่องทางการติดต่อ
                        </h4>
                        <p className="paragraph-text text-gray-700 text-base">
                          หากมีข้อสงสัยเกี่ยวกับนโยบายความเป็นส่วนตัว
                          กรุณาติดต่อเราผ่านช่องทางที่ระบุไว้
                        </p>
                        <ul className="paragraph-text list-inside list-disc text-gray-700 mb-4 text-base">
                          <li>
                            อีเมล:{" "}
                            <a
                              href="mailto:example@email.com"
                              className="text-blue-500 hover:underline"
                            >
                              example@email.com
                            </a>
                          </li>
                          <li>เบอร์โทรศัพท์: [เบอร์โทรศัพท์ของคุณ]</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="text-center mt-7">
        <p className="text-base">
          มีบัญชีอยู่แล้ว?
          <Link to={"/login"}>
            <span className="text-blue-600 font-semibold hover:underline text-base">
              {" "}
              เข้าสู่ระบบ
            </span>
          </Link>
        </p>
      </div>
      <p className="text-center text-base mt-10 mb-5">หรือ</p>
      <OAuth />
      {error && <p className="text-red-500 m">{error}</p>}
    </div>
  );
}

export default Register;
