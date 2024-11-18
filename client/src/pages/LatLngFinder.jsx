import React from "react";

function LatLngFinder() {
  return (
    <div className="max-w-[65ch] mx-auto px-5 py-5 mt-24">
      <h1 className="text-4xl font-light text-center text-gray-900 mb-5">
        การหาละติจูดและลองจิจูด
      </h1>
      <p className="text-xl font-light text-gray-700 mb-2">
        วิธีหาค่าละติจูด ลองจิจูด มีวิธีดังนี้:
      </p>
      <ol className="list-decimal pl-5">
        <li className="mb-2 text-xl font-light text-gray-700">
          เข้าเว็บไซต์{" "}
          <a
            href="https://www.google.co.th/maps"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#5222ff] underline mr-2"
          >
            Google Maps
          </a>
          โดยการคลิกที่ลิงก์ด้านบน ซึ่งจะเปิดหน้าใหม่ในแท็บถัดไป
        </li>
        <li className="text-xl font-light text-gray-700 mb-2">
          ใช้แถบค้นหาที่ด้านบนเพื่อค้นหาพื้นที่ที่ต้องการกำหนดพิกัด
        </li>
        <li className="text-xl font-light text-gray-700 mb-2">
          สำหรับ PC:
          <ul className="pl-5 mt-1">
            <li>
              นำเมาส์ไปคลิกที่บริเวณที่ต้องการกำหนดพิกัด เมื่อคลิกแล้ว
              ในช่องค้นหาที่ด้านขวาจะปรากฏค่าละติจูดและลองจิจูด
            </li>
          </ul>
        </li>
        <li className="text-xl font-light text-gray-700 mb-2">
          สำหรับมือถือ:
          <ul className="pl-5 mt-1">
            <li>เปิดแอป Google Maps บนมือถือของคุณ</li>
            <li>ใช้แถบค้นหาที่ด้านบนเพื่อค้นหาพื้นที่ที่ต้องการ</li>
            <li>
              แตะและค้างที่บริเวณที่ต้องการจนปรากฏป๊อปอัปที่แสดงพิกัดละติจูดและลองจิจูด
            </li>
          </ul>
        </li>
      </ol>
    </div>
  );
}

export default LatLngFinder;
