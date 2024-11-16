import React from "react";
import SearchBar from "../components/SearchBar";

function Home() {
  return (
    <div className="prose mt-8 text-lg leading-relaxed tracking-wide text-primary-200">
      <div className="flex flex-col items-center justify-start min-h-screen overflow-x-hidden scroll-smooth">
        <div
          className="flex items-center justify-center w-full h-screen text-center bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/bg-home.jpg')" }}
        >
          <div className="max-w-full px-5">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 bg-gradient-to-b from-[#4d7cbf] to-[#689ee9] text-transparent bg-clip-text stroke-[2px] stroke-[#fff9ef]">
              เราจะช่วยคุณค้นหาสถานที่ที่คุณชื่นชอบ
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl font-extrabold text-[#fff9ef]">
              ด้วยแหล่งขายบ้านและอสังหาริมทรัพย์ใกล้ตัวคุณ
            </p>
            <SearchBar />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
